---
date: 2021-11-02
categories:
    - tech-notes
---

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

Returning from `Clang::contructJob`, `addSanitizerRuntimes` will expand linker
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
    -fno-sanitize-coverage=indirect-calls,trace-cmp,stack-depth,pc-table \
    foo.c
```

In this way, only `edge` and `inline-8bit-counters` are enabled.

## Flow of instrumentations

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
    - for (auto &BB : F) {
        BlocksToInstrument.push_back(&BB);
        for (auto &Inst: BB) { /* simplified */
          if (IndirectCalls && xxx) IndirCalls.push_back(&Inst)
          if (TraceCmp && xxx) CmpTraceTargets.push_back(&Inst)
          if (TraceCmp && xxx) SwitchTraceTargets.push_back(&Inst)
          if (TraceDiv && xxx) DivTraceTargets.push_back(BO)
          if (TraceGep && xxx) GepTraceTargets.push_back(BO)
          if (TraceStackDepth && xxx) IsLeafFunc = false;
        }
      }
    - stage 2
        InjectCoverage(F, BlocksToInstrument, IsLeafFunc);
        InjectCoverageForIndirectCalls(F, IndirCalls);
        InjectTraceForCmp(F, CmpTraceTargets);
        InjectTraceForSwitch(F, SwitchTraceTargets);
        InjectTraceForDiv(F, DivTraceTargets);
        InjectTraceForGep(F, GepTraceTargets);
```

The key function in stage 2 is `InjectCoverage`.

`InjectCoverage` first create FunctionGuardArray, Function8bitCounterArray,
FunctionBoolArray, or FunctionPCsArray in `CreateFunctionLocalArrays`, then
invoke `InjectCoverageAtBlock` to handle each basic blocks.
`InjectCoverageAtBlock` will instrument `SanCovTracePC`, `SanCovTracePCGuard`,
`Inline8BitCounters`, or `InlineBoolFlag`, or update the lowest stack frame, for
each basic block.

## Details of stubs

Please also refer to [this](https://clang.llvm.org/docs/SanitizerCoverage.html).

### __sanitizer_cov_indir_call

This will be in front of an indirect call. It requires at least one of
`trace-pc`, `trace-pc-guard`, `inline-8bit-counters`, and `inline-bool-flag`.
It accepts one parameter, the callee address. The address of the caller is
passed implicitly via caller PC. Importantly, if the callee is inline assembly,
the indirect call will not be instrumented. Its implementation in libFuzzer is
in the following. In the end, new information will be updated into the value
profile.

``` c++
#define GET_CALLER_PC() __builtin_return_address(0)

void TracePC::HandleCallerCallee(uintptr_t Caller, uintptr_t Callee) {
  const uintptr_t kBits = 12;
  const uintptr_t kMask = (1 << kBits) - 1;
  uintptr_t Idx = (Caller & kMask) | ((Callee & kMask) << kBits);
  ValueProfileMap.AddValueModPrime(Idx);
}

void __sanitizer_cov_trace_pc_indir(uintptr_t Callee) {
  uintptr_t PC = reinterpret_cast<uintptr_t>(GET_CALLER_PC());
  fuzzer::TPC.HandleCallerCallee(PC, Callee);
}
```

### __sanitizer_cov_trace_[const_]cmp[1|2|4|8]

These will be in front of a cmp instruction with const operand or not. They
accept both operands to be compared. The address of the caller is passed
implicitly via caller PC. One of its implementation in libFuzzer is in the
following. In the end, new information will be updated into the value profile.

``` c++
#define GET_CALLER_PC() __builtin_return_address(0)

template <class T>
void TracePC::HandleCmp(uintptr_t PC, T Arg1, T Arg2) {
  uint64_t ArgXor = Arg1 ^ Arg2;
  if (sizeof(T) == 4)
      TORC4.Insert(ArgXor, Arg1, Arg2);
  else if (sizeof(T) == 8)
      TORC8.Insert(ArgXor, Arg1, Arg2);
  uint64_t HammingDistance = Popcountll(ArgXor);  // [0,64]
  uint64_t AbsoluteDistance = (Arg1 == Arg2 ? 0 : Clzll(Arg1 - Arg2) + 1);
  ValueProfileMap.AddValue(PC * 128 + HammingDistance);
  ValueProfileMap.AddValue(PC * 128 + 64 + AbsoluteDistance);
}

void __sanitizer_cov_trace_cmp1(uint8_t Arg1, uint8_t Arg2) {
  uintptr_t PC = reinterpret_cast<uintptr_t>(GET_CALLER_PC());
  fuzzer::TPC.HandleCmp(PC, Arg1, Arg2);
}
```

Similarly stubs are `__sanitizer_cov_trace_switch`,
`__sanitizer_cov_trace_div[4|8]`, and `__sanitizer_cov_trace_gep`.  They all
invoke HandleCmp at the end to update new information into the value profile.

### __sanitizer_cov_trace_pc

This will be at the entry of each basic block. The address of the caller is
passed implicitly via caller PC. This is deprecated.

### __sanitizer_cov_trace_pc_guard[_init]

`__sanitizer_cov_trace_pc_guard` will be at the entry of each basic block after
`__sanitier_cov_trace_pc`. The address of the caller is passed implicitly via
caller PC. They are deprecated.

Each function would have a function guard array `int32_t FunctionGuardArray[]`
whose size is the number of the basic blocks. This array is associated with
`sancov_guards` section. `__sanitizer_cov_trace_pc_guard` accepts
`FunctionGuardArray[IdxofBB]` as the guard.

If any function guard array, SanCov will create a section named
`sancov.module_ctor_trace_pc_guard` to invoke
`__sanitizer_cov_trace_pc_guard_init` to initialize `sancov_guards` for each
module.

[NOT SURE] In the end, after linking, there will be one `sancov_guards` and one
`sancov.module_ctor_trace_pc_guard`.

### __sanitizer_cov_8biPCTableEntryIdxpc_guard`.

Each function would have a function 8bit counter array `int8_t
Function8BitArray[]` whose size is the number of the basic blocks. This array is
associated with `sancov_cntrs` section. If a basic block is visited, then the
corresponding byte in the array will be increased by 1.

If any function 8bit array, SanCov will create a section named
`sancov.module_ctor_8bit_counters` to invoke
`__sanitizer_cov_8bit_counters_init` to initialize `sancov_cntrs` for each
module.

[NOT SURE] In the end, after linking, there will be one `sancov_cntrs` and one
`sancov.module_ctor_8bit_counters`.

`__sanitizer_cov_8bit_counters_init` is defined in the following. It shows the
counter information flows to `Modules` in the libFuzzer. In short, `Modules`
records the start and the stop address of the `sancov_cntrs` divided by page
(`Region`).

``` c++
void TracePC::HandleInline8bitCountersInit(uint8_t *Start, uint8_t *Stop) {
  if (Start == Stop) return;
  if (NumModules &&
      Modules[NumModules - 1].Start() == Start)
    return;
  assert(NumModules <
         sizeof(Modules) / sizeof(Modules[0]));
  auto &M = Modules[NumModules++];
  uint8_t *AlignedStart = RoundUpByPage(Start);
  uint8_t *AlignedStop  = RoundDownByPage(Stop);
  size_t NumFullPages = AlignedStop > AlignedStart ?
                        (AlignedStop - AlignedStart) / PageSize() : 0;
  bool NeedFirst = Start < AlignedStart || !NumFullPages;
  bool NeedLast  = Stop > AlignedStop && AlignedStop >= AlignedStart;
  M.NumRegions = NumFullPages + NeedFirst + NeedLast;;
  assert(M.NumRegions > 0);
  M.Regions = new Module::Region[M.NumRegions];
  assert(M.Regions);
  size_t R = 0;
  if (NeedFirst)
    M.Regions[R++] = {Start, std::min(Stop, AlignedStart), true, false};
  for (uint8_t *P = AlignedStart; P < AlignedStop; P += PageSize())
    M.Regions[R++] = {P, P + PageSize(), true, true};
  if (NeedLast)
    M.Regions[R++] = {AlignedStop, Stop, true, false};
  assert(R == M.NumRegions);
  assert(M.Size() == (size_t)(Stop - Start));
  assert(M.Stop() == Stop);
  assert(M.Start() == Start);
  NumInline8bitCounters += M.Size();
}

void __sanitizer_cov_8bit_counters_init(uint8_t *Start, uint8_t *Stop) {
  fuzzer::TPC.HandleInline8bitCountersInit(Start, Stop);
}
```

### __sanitizer_cov_bool_flag_init

The inline bool flag will be at the entry of each basic block after the inline
8bit counters.

Each function would have a function 1 bit array `int1_t FunctionBoolArray[]`
whose size is the number of the basic blocks. This array is associated with
`sancov_bools` section. If a basic block is visited, then the corresponding bit
in the array will be true.

If any function bool array, SanCov will create a section named
`sancov.module_ctor_bool_flag` to invoke `__sanitizer_cov_bool_flag_init` to
initilize `sancov_bools` for each module.

[NOT SURE] In the end, after linking, there will be one `sancov_bools` and one
`sancov.module_ctor_bool_flag`.

`__sanitizer_cov_bool_flag_init` is not defined in the libFuzzer.

### __sanitizer_cov_pcs_init

For each function, SanCov creates a PC array associated with `sancov_pcs` to
store `{PC, PCFlags}` pairs. PC is the address of the corresponding basic block,
and a PCFlags describes the basic block is the function entry block (1) or not
(0).

If one of the `trace-pc-guard`, `inline-8bit-counters`, and `inline-bool-flag`,
and any function PC array, SanCov will invoke `__sanitizer_cov_pcs_init` to
initilize `sancov_pcs` for each module in one of the section: `sancov.xxx`.

[NOT SURE] In the end, after linking, there will be one `sancov_pcs`.

`__sanitizer_cov_pcs_init` is defined in the following. In short, the
information flows to `ModulePCTable` in libFuzzer.

``` c++
void TracePC::HandlePCsInit(const uintptr_t *Start, const uintptr_t *Stop) {
  const PCTableEntry *B = reinterpret_cast<const PCTableEntry *>(Start);
  const PCTableEntry *E = reinterpret_cast<const PCTableEntry *>(Stop);
  if (NumPCTables && ModulePCTable[NumPCTables - 1].Start == B) return;
  assert(NumPCTables < sizeof(ModulePCTable) / sizeof(ModulePCTable[0]));
  ModulePCTable[NumPCTables++] = {B, E};
  NumPCsInPCTables += E - B;
}

void __sanitizer_cov_pcs_init(const uintptr_t *pcs_beg,
                              const uintptr_t *pcs_end) {
  fuzzer::TPC.HandlePCsInit(pcs_beg, pcs_end);
}
```

### A brief list of (flag, stubs, and information sink in libFuzzer)

|Flag|Stubs|Information Sink|
|:---:|:---:|:---:|
|trace-pc,indirect-calls|__sanitizer_cov_trace_pc_indirect|ValueProfileMap|
|trace-pc-guard,indirect-calls|__sanitizer_cov_trace_pc_indirect|ValueProfileMap|
|inline-8bit-counters,indirect-calls|__sanitizer_cov_trace_pc_indirect|ValueProfileMap|
|inline-bool-flag,indirect-calls|__sanitizer_cov_trace_pc_indirect|ValueProfileMap|
|trace-cmp|__sanitizer_cov_trace\_[const\_]cmp[1\|2\|4\|8]|ValuleProfileMap|
|trace-switch|__sanitizer_cov_trace_switch|ValuleProfileMap|
|trace-div|__sanitizer_cov_trace_div[4\|8]|ValuleProfileMap|
|trace-gep|__sanitizer_cov_trace_gep|ValuleProfileMap|
|trace-pc|__sanitizer_cov_trace_pc|deprecated|
|trace-pc-guard|__sanitizer_cov_trace_pc_guard[\_init]|deprecated|
|inline-8bit-counters|__sanitizer_cov_8bit_counters_init|Modules|
|inline-bool-flag|__sanitizer_cov_bool_flag_init|not supported|
|trace-pc-guard,pc-table|__sanitizer_cov_pcs_init|ModulePCTable|
|inline-8bit-guard,pc-table|__sanitizer_cov_pcs_init|ModulePCTable|
|inline-bool-flag,pc-table|__sanitizer_cov_pcs_init|ModulePCTable|

[^1]: [Clangedge-coverage](https://clang.llvm.org/docs/SanitizerCoverage.html#edge-coverage)

## Details of coverage collection algorithm and implementation

Recalling that several stubs are instrumented to the target program. The implementation of these stubs are implemented in libFuzzer by default or can be replaced by developers. Most of them are defined in compiler-rt/lib/fuzzer/FuzzerTracePC.cpp. After testing an input, these stubs will update corresponding information. LibFuzzer will then calculate the coverage with the information. A detailed flow is in the following.

``` c++
ExecuteCallback
    - TPC.ResetMaps();
    - CB(DataCopy, Size);
TPC.CollectFeatures();
if (NumNewFeatures || ForceAddToCorpus) {
  TPC.UpdateObservedPCs();
}
```

### ResetMaps

``` c++
template <class Callback>
void IterateCounterRegions(Callback CB) {
  for (size_t m = 0; m < NumModules; m++)
    for (size_t r = 0; r < Modules[m].NumRegions; r++)
      CB(Modules[m].Regions[r]);
}

void TracePC::ClearInlineCounters() {
  IterateCounterRegions([](const Module::Region &R){
    if (R.Enabled)
      memset(R.Start, 0, R.Stop - R.Start);
  });
}

void ResetMaps() {
  ValueProfileMap.Reset();
  ClearExtraCounters();
  ClearInlineCounters();
}
```

TPC.ResetMaps reset 1) ValueProfileMap, a bit map for data flow value, 2)
ExtraCounters, 3) InlineCouters, the area for `inline-8bit-counters`.

### CollectFeatures

``` c++
size_t NumUpdatesBefore = Corpus.NumFeatureUpdates();
TPC.CollectFeatures([&](size_t Feature) {
  if (Corpus.AddFeature(Feature, Size, Options.Shrink))
    // *
});
```

`TPC.CollectFeatures` accepts a HandleFeature function pointer. In the
HandleFeature, it accepts a Feature that is calculated from all the coverage
information (Information Sink), and then adds the feature to the corpus.

AddFeature is part of the HandleFeature function to log features. libFuzzer will
map a feature to the size of the corresponding input.  If the size is zero, the
feature is not visited.

``` c++
bool AddFeature(size_t Idx, uint32_t NewSize, bool Shrink) {
  Idx = Idx % kFeatureSetSize;
  uint32_t OldSize = GetFeature(Idx);
  if (OldSize == 0 || (Shrink && OldSize > NewSize)) {
    if (OldSize > 0) {
      // ...
    } else {
      NumAddedFeatures++;
      // ...
    }
    NumUpdatedFeatures++;
    InputSizesPerFeature[Idx] = NewSize;
    return true;
  }
  return false;
}
```

In `TPC.CollectFeatures`, it maps the information sinks to features like below.

``` txt
// Modules (Inlint8BitCounters)
FirstFeature=0
                         feature
      0    8    w/o counters  w/ counters
      +----+
BB00  +d'02+    +0            +(0*8 + log(2))
      +----+
BB01  +d'80+    +1            +(1*8 + log(80))
      +----+
FirstFeature += NumOfBits(Modules)
// ExtracCounters
      0    8    w/o counters  w/ counters
      +----+
CNT0  +d'02+    +0            +(0*8 + log(2))
      +----+
CNT1  +d'80+    +1            +(1*8 + log(80))
      +----+
FirstFeature += NumOfBits(ExtraCounters)
// ValueProfileMap
      0    8
      +----+
VPM0  +d'02+    +6 (b'00000010)
      +----+
VPM8  +d'82+    +8/+14 (b'10000010)
      +----+
FirstFeature += NumOfBits(ValueProfileMap)
// StackDepth
                + StackDepthStepFunction(MaxStackOffset / 8)
```

In general, we map coverage information to a linear feature from zero. For the
`Modules`, libFuzzer checks each byte that records how many times a basic block is
visited. If without counters, the feature is the start feature plus the index of
the bytes. For BB01, if the index is 1, then the feature is 1. If with counter,
it will take d'80 into consideration. The feature is 0 plus log(80). The
logarithmic function guarantees the feature will not overflow 8 bits. In the
end, the start of the new features will be updated by adding the bit number of
modules. `ExtraCounters` works similarly. For the ValueProfileMap, each non-zero
bit is a new feature. For the stack depth, it leverages a hash function
StackDepthStepFunction.

### UpdateObservedPCs

If any new features, libFuzzer will update observed PCs.

``` c++
for (size_t i = 0; i < NumModules; i++) {
  auto &M = Modules[i];
  for (size_t r = 0; r < M.NumRegions; r++) {
    auto &R = M.Regions[r];
    if (!R.Enabled) continue;
    for (uint8_t *P = R.Start; P < R.Stop; P++)
      if (*P) // if this basic block is visited
        // then get the PC of the visited the basic block
        // then invoke Observe
        Observe(&ModulePCTable[i].Start[M.Idx(P)]);
  }
}
```

First, if a basic block is visited, libFuzzer will get the PC of the visited the
basic in the PCTable, and invoke `Observe`.

``` c++
Vector<uintptr_t> CoveredFuncs;
auto ObservePC = [&](const PCTableEntry *TE) {
  if (ObservedPCs.insert(TE).second && DoPrintNewPCs) {
    PrintPC("\tNEW_PC: %p %F %L", "\tNEW_PC: %p",
            GetNextInstructionPc(TE->PC));
    Printf("\n");
  }
};

auto Observe = [&](const PCTableEntry *TE) {
  if (PcIsFuncEntry(TE))
    if (++ObservedFuncs[TE->PC] == 1 && NumPrintNewFuncs)
      CoveredFuncs.push_back(TE->PC);
  ObservePC(TE);
};
```

If the basic block is the entry, then update `ObservedFunc`. Otherwise, invoke
`ObservePC` to update `ObservedPCs`.

## libFuzzer intercepts

LibFuzzer will intercepts `memcmp`, `strncmp`, `strcmp`, `strncasecmp`,
`strcasecmp`, `strstr`, `strcasestr`, and `memmem` functions if no ASAN, TSAN,
MSAN runtime is enabled. It is not easy to disable this behavior.

A typical flow for each above function is in the following.

``` c++
    RunningUserCallback = true;
    int Res = CB(DataCopy, Size);
    RunningUserCallback = false;

int memcmp(const void *s1, const void *s2, size_t n) {
  if (!FuzzerInited)
    return internal_memcmp(s1, s2, n);
  int result = REAL(memcmp)(s1, s2, n);
  __sanitizer_weak_hook_memcmp(GET_CALLER_PC(), s1, s2, n, result);
  return result;
}

void __sanitizer_weak_hook_memcmp(void *caller_pc, const void *s1,
                                  const void *s2, size_t n, int result) {
  if (!fuzzer::RunningUserCallback) return;
  if (result == 0) return;  // No reason to mutate.
  if (n <= 1) return;  // Not interesting.
  fuzzer::TPC.AddValueForMemcmp(caller_pc, s1, s2, n, /*StopAtZero*/false);
}
```

Here is a summary of where the collected information will flow.

|Function||Information Sink|
|:---:|:---:|:---:|
|memcmp|AddValueForMemcmp|ValueProfileMap|
|strnmp|AddValueForMemcmp|ValueProfileMap|
|strcmp|AddValueForMemcmp|ValueProfileMap|
|strncasecmp|AddValueForMemcmp|ValueProfileMap|
|strcasecmp||AddValueForMemcmp|ValueProfileMap|
|strstr||MMT(Mutation Only)|
|strcasestr||MMT(Mutation Only)|
|memmem||MMT(Mutation Only)|

To disable them, we could 1) use `-use_value_profile=0` when fuzzing to avoid
update coverage information from ValueProfileMap, 2) comment these
`__sanitizer_weak_hook_xxx` to reduce the overhead. Luckily,
`-use_value_profile=0` is the default option of libFuzzer.

## Conclusion

+ For the basic block coverage, SanCov maintains an array that records how many
times a basic block is visited, and the libFuzzer will collect that information
and calculate features.

+ To disable fancy features, just do as below.

``` bash
clang -o foo -fsanitize=fuzzer \
    -fsanitize-coverage=bb \
    -fno-sanitize-coverage=indirect-calls,trace-cmp,stack-depth,pc-table \
    foo.c
```