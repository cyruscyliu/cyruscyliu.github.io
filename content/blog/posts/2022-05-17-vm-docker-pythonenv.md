---
date: 2022-05-17
categories:
    - Tech Notes
---

# A layered experiment environment

In the places where I worked during the last five years, I've suffered a lot
from "different computation infrastructure". One place has two physical servers
with Ubuntu installed, another place has only one physical server but uses PVE
to manage virtual machines assigned to specific users, and another place has a
lot of servers shared with dozens of users. Not only the architectures are
different but also the operating systems installed are different. Most of them
use Ubuntu but some use Debian. For the majority, I have a hard time handling
different Ubuntu versions as Ubuntu upgrades too fast (for me).

I'm thinking of getting rid of the dependency on the underlying computation
infrastructure with an idea of layered experiment environment.

```
QEMU + Ubuntu + KVM -> Layer 1: independent on the underlying computation infrastructure
Docker container    -> Layer 2: independent on the underlying operating system
```

## Layer 1: Vagrant

Given a new computation infrastructure, the only effort here is to maintain a
list of configurations of a virtual machine and find a tool like Vagrant to help
to set all up.

"[Vagrant](https://en.wikipedia.org/wiki/Vagrant_(software)) is an open-source
software product for building and maintaining portable virtual software
development environments; e.g., for VirtualBox, KVM, Hyper-V, Docker containers,
VMware, and AWS. It tries to simplify the software configuration management of
virtualization in order to increase development productivity." -- Wikipedia

Command lines are in the following.

```
vagrant init generic/ubuntu1804
vagrant up --provider=libvirt
vagrant ssh
vagrant status
vagrant halt
```

Please look at `Vagrantfile` for more configuration.

[^1]: [install libVirt on Ubuntu 20.04](https://linuxize.com/post/how-to-install-kvm-on-ubuntu-20-04/)
[^2]: [usage of libvirt vagrant](https://ostechnix.com/how-to-use-vagrant-with-libvirt-kvm-provider/)

## Layer 2: Docker

Given a new operating system, the only effort here is to maintain a Dockerfile.

Command lines are in the following.

```
# you may want a .dockerignore to skip large files and directories
docker build -t tag:latest .
docker run --rm -it -v path-outside:path-inside tag:latest /bin/bash
```

Please look at Docker's official documentations for more commands.

In summary, I've saved a lot of time following the above routines.

You don't want to become a server maintainer in different places, right?