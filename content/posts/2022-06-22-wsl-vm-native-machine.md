# Windows, Windows Subsystem Linux (WSL), VirtualBox Ubuntu, Native Ubuntu

I'm thinking about which solution is better for research and development.

## Windows v.s Ubuntu

After running Ubuntu on a native machine, I've been using Windows for years. The
reason I switched from Native Ubuntu to Windows was I wanted to use the
Microsoft Office suite and WeChat (and DingTalk). Therefore, I would use the WSL
for development. Microsoft office suite and WeChat for Windows are convenient,
but WSL is not. As I am working on hypervisors and kernels, WSL cannot always
provide all features for them. For example, I cannot even start a VirtualBox
virtual machine in WSL (as WSL doesn't support loading extra kernel modules).
Moreover, Windows itself has a lot of extra and implicit workload consuming my
CPU and I/O time, which sometimes makes me crazy.

A list of WSL issues

+ In WSL, I need to handle "RWX" for any files from the host
+ In WSL, I need to handle "CRLF" for any files from the host
+ In WSL, it's slow to list files on the host
+ In WSL, I cannot access the port I set to connect to a VirtualBox virtual machine 

Microsoft office suite can be replaced by Google office suite. However, stupid
Chinese IM apps, WeChat and DingTalk are not easily replaced. Wine is one of the
solutions to support them. However, the notification is kind of floppy.

All in all, I want to switch back to Ubuntu (or other distributions) due to my
requirement for hardware. I'm going to use Google office suite to take notes.
For these IM apps, I will use them on my cellphone with auto-start (in the
background) and strong notification enabled. When using my cellphone, I try to
reply as short as possible. In practice, I am slow in replying but this seems
good. IMO, IM apps are disasters for maintaining our focus on research and
development.

## VirtualBox and Native Ubuntu

I prefer a Native Ubuntu for the host. A virtual machine is good for any
experimental task.

## Followup

- I graduated and rarely need to process Microsoft office files.
- WeChat is supported on Ubuntu/Debian.
- I'm using Debian because upgrading Ubuntu breaks many things.
- I'm switching to i3-wm.
- I'm using my laptop anywhere (even in the office) 1) to enable remote
work, 2) to avoid configing everything again.

