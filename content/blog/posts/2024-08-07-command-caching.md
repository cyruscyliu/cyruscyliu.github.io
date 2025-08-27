---
date: 2024-08-07
---

# Bash command hashing

Reference:
https://unix.stackexchange.com/questions/554785/why-does-shell-use-executable-in-usr-bin-and-not-in-usr-local-bin

Bash will hash commands: amazing, In other words, when any command is executed
without naming its path, the shell starts searching for that command within the
directories, which are listed in the path variable. When the Bash gets that
command, it keeps the location in a hash table so that it can remember the
location of the command. After that, Bash starts checking the table to find the
location of the command instead of looking for the command again. It makes the
command run faster. However, if the command is moved after recording its
location in a table, the shell will not be able to find the command. In this
case, a full search of the directories in the path is performed to get the
command data.

The Filesystem Hierarchy Standard describes the filesystem conventions of a
Linux system. In this standard, folders /lib, /usr/lib and /usr/local/lib are
the default folders to store shared libraries. The /lib folder has libraries
used during the boot time of the system but also used by programs in the /bin
folder. Similarly, the/usr/lib folder has libraries used by programs in the
/usr/bin folder. Finally, /usr/local/lib folder has libraries used by programs
in /usr/local/bin folder. Therefore, we may first check these standard paths to
find out if a specific shared library is installed on our system. (You never
know when you will use this information when you learn it …)

Libraries are also cached. So, after clear the command cache. You must clear the
ldconfig cache. That’s what we will not learn from the textbook!!!!!! When
teaching Linux kernel, also search on stack overflow:
https://stackoverflow.com/questions/17889799/libraries-in-usr-local-lib-not-found