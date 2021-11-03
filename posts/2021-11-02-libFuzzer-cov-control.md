# Coverage Control in libFuzzer

This article reveals how to control the coverage collection in libFuzzer.

## How to use libFuzzer?

To use libFuzzer, it is necessary to develop a fuzz target. Please refer to
[this](https://llvm.org/docs/LibFuzzer.html#id14) and
[this](https://llvm.org/docs/LibFuzzer.html#id23) to check how to develop a fuzz
target and how to compile it with Clang.

## How to compiler LLVM project?

Download llvm-project and compile like below. Please also refer to
[this](https://llvm.org/docs/GettingStarted.html) and
[this](https://clang.llvm.org/get_started.html).

``` bash
git clone https://github.com/llvm/llvm-project.git --depth=1
mkdir build; cd build
cmake -G Ninja -DLLVM_USE_LINKER=gold -DLLVM_ENABLE_PROJECTS="clang;compiler-rt" -DLLVM_TARGETS_TO_BUILD=X86 -DLLVM_OPTIMIZED_TABLEGEN=ON ../llvm/
ninja clang compiler-rt
export PATH=$PWD/bin:$PATH
```

## Details beneath `-fsanitize=fuzzer`

As we all know, when compiling a program, a compiler will automatically expand
its compiler flags. If `-v` is enable, the compiler will show all flags.
Considering a very simple example: `clang -o foo -fsanitize=fuzzer foo.c`, the
full flags related to `-fsanitize` are in the following.

``` txt
# SIMPLIFIED
"$LLVM/bin/clang-13" -cc1 \
   -triple x86_64-unknown-linux-gnu \
   -emit-obj \
   -target-cpu x86-64 -v \
   -fsanitize-coverage-type=1 -fsanitize-coverage-type=3 \
   -fsanitize-coverage-indirect-calls \
   -fsanitize-coverage-trace-cmp \
   -fsanitize-coverage-inline-8bit-counters \
   -fsanitize-coverage-pc-table \
   -fsanitize-coverage-stack-depth \
   -fsanitize-coverage-trace-state \
   -fsanitize=fuzzer,fuzzer-no-link \
   -o /tmp/main-d501e8.o -x c main.c
# SIMPLIFIED
"/usr/local/bin/ld" -z relro \
   --hash-style=gnu --eh-frame-hdr \
    -m elf_x86_64 \
    -dynamic-linker /lib64/ld-linux-x86-64.so.2 \
    -o main \
    $LLVM/lib/clang/13.0.0/lib/linux/libclang_rt.fuzzer-x86_64.a \
    $LLVM/lib/clang/13.0.0/lib/linux/libclang_rt.fuzzer_interceptors-x86_64.a \
    $LLVM/lib/clang/13.0.0/lib/linux/libclang_rt.ubsan_standalone-x86_64.a \
    --dynamic-list=$LLVM/lib/clang/13.0.0/lib/linux/libclang_rt.ubsan_standalone-x86_64.a.syms \
    /tmp/main-d501e8.o
```

It's `SanitizerArgs()` that parses SanCov and sanitizers flags. The path to it
is in the following.

```
 [#0] clang::driver::SanitizerArgs::SanitizerArgs()
 [#1] clang::driver::ToolChain::getSanitizerArgs() const()
 [#2] clang::driver::toolchains::Linux::isPIEDefault() const()
 [#3] clang::driver::tools::ParsePICArgs()
 [#4] clang::driver::tools::Clang::ConstructJob()
 [#5] clang::driver::Driver::BuildJobsForActionNoCache()
 [#6] clang::driver::Driver::BuildJobsForAction()
 [#7] clang::driver::Driver::BuildJobsForActionNoCache()
 [#8] clang::driver::Driver::BuildJobsForAction()
 [#9] clang::driver::Driver::BuildJobs()
[#10] clang::driver::Driver::BuildCompilation()
[#11] main()
```

In `SanitizerArgs()`, `parseArgValues` will parse six sanitizer related flags.
`parseArgValues` will invoke `parseSanitizerValue` defined in
`clang/lib/Basic/Sanitizers.cpp` to parse sanitizers defined
`clang/include/clang/Basic/Sanitizers.def`.

``` c
// clang/include/clang/Basic/Sanitizers.def
// libFuzzer
SANITIZER("fuzzer", Fuzzer)

// libFuzzer-required instrumentation, no linking.
SANITIZER("fuzzer-no-link", FuzzerNoLink)
```

In `SanitizerArgs()`, `parseCoverageFeatures` will parse two flags:
`-fsanitize-coverage=<value>` and `-fno-sanitize-coverage=<value>` to control
what kind of coverage information for sanitizers. Try `clang --help | grep
coverage` to see more related flags.

``` c
int parseCoverageFeatures(const Driver &D, const llvm::opt::Arg *A) {
  assert(A->getOption().matches(options::OPT_fsanitize_coverage) ||
         A->getOption().matches(options::OPT_fno_sanitize_coverage));
  int Features = 0;
  for (int i = 0, n = A->getNumValues(); i != n; ++i) {
    const char *Value = A->getValue(i);
    int F = llvm::StringSwitch<int>(Value)
                .Case("func", CoverageFunc)
                .Case("bb", CoverageBB)
                .Case("edge", CoverageEdge)
                .Case("indirect-calls", CoverageIndirCall)
                .Case("trace-bb", CoverageTraceBB)
                .Case("trace-cmp", CoverageTraceCmp)
                .Case("trace-div", CoverageTraceDiv)
                .Case("trace-gep", CoverageTraceGep)
                .Case("8bit-counters", Coverage8bitCounters)
                .Case("trace-pc", CoverageTracePC)
                .Case("trace-pc-guard", CoverageTracePCGuard)
                .Case("no-prune", CoverageNoPrune)
                .Case("inline-8bit-counters", CoverageInline8bitCounters)
                .Case("inline-bool-flag", CoverageInlineBoolFlag)
                .Case("pc-table", CoveragePCTable)
                .Case("stack-depth", CoverageStackDepth)
                .Default(0);
    if (F == 0)
      D.Diag(clang::diag::err_drv_unsupported_option_argument)
          << A->getOption().getName() << Value;
    Features |= F;
  }
  return Features;
}
```

`parseCoverageFeatures` clearly show what kind of coverage we can control. In
the following are several tips to enable and disable these coverage flags.
+ `func`, `bb`, and `edge` are mutually exclusive
+ `trace-bb` is deprecated, use `trace-pc-guard` instead
+ `8bit-counter` is deprecated, use `trace-pc-guard` instead
+ if use one of `func`, `bb`, and `edge`, `trace-pc-guard` or `trace-pc` must be enabled
+ if one of `trace-pc`, `trace-pc-guard`, `inline-8bit-counter`, and `inline-bool-flag`
is enabled without any `func`, `bb`, or `edge`, then `edge` is added by default
+ `stack-depth` needs `func`

Returning from `SanitizerArgs()`,  `ConstructJob` will invoke `addArgs` to
append flags to the command line `clang -o foo -fsanitize=fuzzer foo.c`.

``` txt
[#0] 0x55555a470fa2 → clang::driver::SanitizerArgs::addArgs()
[#1] 0x55555a3c6572 → clang::driver::tools::Clang::ConstructJob()
[#2] 0x55555a345a9a → clang::driver::Driver::BuildJobsForActionNoCache()
[#3] 0x55555a343f99 → clang::driver::Driver::BuildJobsForAction()
[#4] 0x55555a344bad → clang::driver::Driver::BuildJobsForActionNoCache()
[#5] 0x55555a343f99 → clang::driver::Driver::BuildJobsForAction()
[#6] 0x55555a34280e → clang::driver::Driver::BuildJobs()
[#7] 0x55555a3345c4 → clang::driver::Driver::BuildCompilation()
```
`addArgs` will add corresponding flags according to the table below.

``` c
std::pair<int, const char *> CoverageFlags[] = {
    std::make_pair(CoverageFunc, "-fsanitize-coverage-type=1"),
    std::make_pair(CoverageBB, "-fsanitize-coverage-type=2"),
    std::make_pair(CoverageEdge, "-fsanitize-coverage-type=3"),
    std::make_pair(CoverageIndirCall, "-fsanitize-coverage-indirect-calls"),
    std::make_pair(CoverageTraceBB, "-fsanitize-coverage-trace-bb"),
    std::make_pair(CoverageTraceCmp, "-fsanitize-coverage-trace-cmp"),
    std::make_pair(CoverageTraceDiv, "-fsanitize-coverage-trace-div"),
    std::make_pair(CoverageTraceGep, "-fsanitize-coverage-trace-gep"),
    std::make_pair(Coverage8bitCounters, "-fsanitize-coverage-8bit-counters"),
    std::make_pair(CoverageTracePC, "-fsanitize-coverage-trace-pc"),
    std::make_pair(CoverageTracePCGuard,
                    "-fsanitize-coverage-trace-pc-guard"),
    std::make_pair(CoverageInline8bitCounters,
                    "-fsanitize-coverage-inline-8bit-counters"),
    std::make_pair(CoverageInlineBoolFlag,
                    "-fsanitize-coverage-inline-bool-flag"),
    std::make_pair(CoveragePCTable, "-fsanitize-coverage-pc-table"),
    std::make_pair(CoverageNoPrune, "-fsanitize-coverage-no-prune"),
    std::make_pair(CoverageStackDepth, "-fsanitize-coverage-stack-depth"),
    std::make_pair(CoverageTraceState, "-fsanitize-coverage-trace-state")};
```

Returning from `Clang::contructJob`, `addSanitizerRuntimes` will expland linker
flags.

``` txt
[#0] 0x55555a3dcbe2 → clang::driver::tools::addSanitizerRuntimes()
[#1] 0x55555a40cac0 → clang::driver::tools::gnutools::Linker::ConstructJob()
[#2] 0x55555a345a9a → clang::driver::Driver::BuildJobsForActionNoCache()
[#3] 0x55555a343f99 → clang::driver::Driver::BuildJobsForAction()
[#4] 0x55555a34280e → clang::driver::Driver::BuildJobs()
[#5] 0x55555a3345c4 → clang::driver::Driver::BuildCompilation()
[#6] 0x555557ddf8f7 → main()
```

In `addSanitizerRuntimes`, `collectSanitizerRuntimes` will collect libraries for
sanitizers.
+ Use `-shared-libsan` (by default) or `-static-libsan` to collect dynamic or static libraries
+ use `-fsanitize-link-runtime"` (by default) or `-fno-sanitize-link-runtime` to switch on or off linking

To use ASAN, assign `-fsanitize=address`. If only `-fsanitize=fuzzer`, then
UBSAN will be enabled.

``` c
bool SanitizerArgs::needsUbsanRt() const {
  // All of these include ubsan.
  if (needsAsanRt() || needsMsanRt() || needsHwasanRt() || needsTsanRt() ||
      needsDfsanRt() || needsLsanRt() || needsCfiDiagRt() ||
      (needsScudoRt() && !requiresMinimalRuntime()))
    return false;

  return (Sanitizers.Mask & NeedsUbsanRt & ~TrapSanitizers.Mask) ||
         CoverageFeatures;
}
```

Shortly, if no other sanitizers is enabled, and if any coverage is enabled,
UBSAN will be enabled.

After `collectSanitizerRuntimes`, `addSanitizerRuntimes` will update runtimes regarding to `-fsanitizer=fuzzer`.

``` c
bool SanitizerArgs::needsFuzzerInterceptors() const {
  return needsFuzzer() && !needsAsanRt() && !needsTsanRt() && !needsMsanRt();
}

bool tools::addSanitizerRuntimes(...) {
  ...
    addSanitizerRuntime(TC, Args, CmdArgs, "fuzzer", false, true);
    if (SanArgs.needsFuzzerInterceptors())
        addSanitizerRuntime(TC, Args, CmdArgs, "fuzzer_interceptors", false, true);
}
```

BTW, `fuzz_interceptors` will be appended if no ASAN, TSAN, MSAN runtime is
enabled.

Finally, to narrow down the coverage collection, we can construct a command in
the following.

``` bash
clang -o foo -fsanitize=fuzzer \
    -fsanitize-coverage=bb,trace-pc \
    -fno-sanitize-coverage=indirect-calls,trace-cmp,inline-8bit-counters,stack-depth,pc-table \
    foo.c
```

In this way, only `bb` and `trace-pc` are enabled.

## Details of different instrumentations

The module pass `SanitizerCoverage`
(llvm/lib/Transforms/Instrumentation/SanitizerCoverage.cpp) will instrument
coverage flag to each module.

In the first state, `SanitizerCoverage` will construct the IR of stubs to be
instrumented. A classic pattern is in the following.

``` c++
const char SanCovTracePCIndirName[] = "__sanitizer_cov_trace_pc_indir";
SanCovTracePCIndir = M.getOrInsertFunction(SanCovTracePCIndirName, VoidTy, IntptrTy);
```

In the second state, `SanitizerCoverage` will traverse all IR code and do
instrumentation at the proper position.

``` c++
IRB.CreateCall(SanCovTracePCIndir, IRB.CreatePointerCast(Callee, IntptrTy));
```

The overall flow of `SanitizerCoverage` is in the following.

``` txt
instrumentModule
    - stage 1
    - for (auto &F : M) { instrumentFunction(F); }
instrumentFunction
    - split edges if edge coverage[^1]
    - for (auto &BB: F) { BlocksToInstrument.push_back(&BB); }
    - stage 2
```

The key function in stage 2 is `InjectCoverage`.

`InjectCoverage` first create FunctionGuardArray and FunctionPCsArray in
`CreateFunctionLocalArrays`, then invoke `InjectCoverageAtBlock` to handle each
basic blocks. `InjectCoverageAtBlock` will instrument `SanCovTracePC`,
`SanCovTracePCGuard` for each basic block.

[^1]: [Clang edge-coverage](https://clang.llvm.org/docs/SanitizerCoverage.html#edge-coverage)