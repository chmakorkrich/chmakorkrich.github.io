---
title: "THM: Investigating Windows"
date: 2025-02-22
# weight: 1
# aliases: ["/first"]
tags: ["THM", "Tryhackme", "Investigating Windows"]
author: "YUN Mony"
# author: ["Me", "You"] # multiple authors
showToc: true
TocOpen: false
draft: false
hidemeta: false
comments: false
description: "Investigating Windows is a machine on Tryhackme website"
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
    image: "cover/t1.jpeg" # image path/url
    alt: "THM : Investigating Windows" # alt text
    # caption: "Fluffy Machine from HackTheBox" # display caption under cover
    relative: true # when using page bundles set this to true
    hidden: false # set to false to show the cover image
    # linkFullImages: true
---

A windows machine has been hacked, its your job to go investigate this windows machine and find clues to what the hacker might have done.

This is a challenge that is exactly what is says on the tin, there are a few challenges around investigating a windows machine that has been previously compromised.

Connect to the machine using RDP. The credentials the machine are as follows:

Username: Administrator  
Password: letmein123!

Please note that this machine does not respond to ping (ICMP) and may take a few minutes to boot up.

# Answer the questions below

## 1. What's the version and year of the windows machine?

### របៀបធ្វើ

Open PowerShell, let's run some commands and get some info. To start off, using the command *Get-ComputerInfo* will list out all the system information.
![[Pasted image 20250115143615.png]]

We need to narrow this down, to do this and knowing what we are looking for, we can use the command *Get-ComputerInfo -Property “Os\*”*. This will only output anything that starts with Os. You will have the answer as the first output entry.

![](https://miro.medium.com/v2/resize:fit:875/1*FMoo8NSLbxkvo6thYcAXGQ.png)

## 2. Which user logged in last?

### របៀបធ្វើ

First we have to see what the names of the LocalUsers are. To do this you can use the command, *Get-LocalUser*. This will enumerate the LocalUsers and give you a list to work with.

![](https://miro.medium.com/v2/resize:fit:875/1*_8Sn-LpuEMDkKr8nvxf-Yw.png)

Now that we have our LocalUser list, we want to use the command, *net user {username} |findstr “Last”*. This will show you the last log in for that user. Once you run this, you will see was the last logged on to the system. The answer really should be a surprise.

![](https://miro.medium.com/v2/resize:fit:759/1*3oCyLDu0LFsonS7EVB6CJg.png)

## 3. When did John log onto the system last?

### របៀបធ្វើ

Go back to the output from the previous question. Look at John, you can copy and past the answer into the answer field. Just make sure that you add two zeros, before the month and day.

![](https://miro.medium.com/v2/resize:fit:759/1*AwrbKb_IOwiJyNrFQEesPw.png)

## 4. What IP does the system connect to when it first starts?

### របៀបធ្វើ

Let us look at the host file to see if the answer can be found in the host file. The file path is, *C:\ > Windows > System32 > drivers > etc,* once in this folder double-click on the *hosts* file.

![](https://miro.medium.com/v2/resize:fit:875/1*Rb5qxQyQqUwaw4vxYzvWdg.png)

Double-click on *hosts* to open it, a window will pop up with *How do you want to open this file?*. Click on *Notepad*.

![](https://miro.medium.com/v2/resize:fit:491/1*I-OEUDApYRh0ag_Tz_aJXA.png)

Inside this file, we can see something is off about it. To start, a lot of the sites are pointed at the local host, and secondly google is in here. Seems like some kind of DNS poisoning is going on. If we had a backup copy or could revert to a previous state, then we would definitely know. We should go to the Registry and see if we can discover where this start up program is connecting too.

![](https://miro.medium.com/v2/resize:fit:875/1*RGX1_g7fkHHyBSvrcz6rsg.png)

Now in the remote desktop, press the Windows key, or click on the *Start Menu* icon. Just start typing *regedit,* this will only yield one result, click on it or press enter.

![](https://miro.medium.com/v2/resize:fit:486/1*lPvdXgTQqaX5xwvhTaiupw.png)

The Registry Editor window will pop up. Follow this path, *HKEY_LOCAL_MACHINE >* *SOFTWARE > Microsoft > Windows > CurrentVersion > Run*. Once you reach that location, you will see two values. The *UpdateSvc* looks sus, checking it out reveals the IP address that the remote machine connects to when it starts up.

![](https://miro.medium.com/v2/resize:fit:664/1*aSgO4qwZVyLvK7I8BjZYmw.png)

## 5. What two accounts had administrative privileges (other than the Administrator user)?

### របៀបធ្វើ

To see what users are in the *Administrators* group, you can use the command, *Get-LocalGroupMember -Group “Administrators”*. Press enter to run the command, in the output you will see the answer. You might just have to switch the users, to get the answer right(I had to).

![](https://miro.medium.com/v2/resize:fit:804/1*LMHB1O2sCIJQqpjci3K4xQ.png)

## 6. What's the name of the scheduled task that is malicious?

### របៀបធ្វើ

Let us see what tasks are scheduled to run on this system, to do this use the command, *Get-ScheduledTask.* Press enter to run the command.

![](https://miro.medium.com/v2/resize:fit:875/1*7ZZY07YEV0UqSNScQEr2mg.png)

Well we get a lot of tasks scheduled to run, we can make this list smaller, let us do that. We can by running the command, *Get-Scheduled | where {$*.TaskPath -eq “\”}.* This will only output anything with a \ _TaskPath,* which will narrow down our list to six. One of these programs is Malicious can you find out which one it is?

![](https://miro.medium.com/v2/resize:fit:875/1*t6QMvlNE7An_MM_r5QO1YQ.png)

## 7. What file was the task trying to run daily?

### របៀបធ្វើ

Let’s equate the command to *$task,* to do this use the command *$task = Get-ScheduledTask | Where TaskName -EQ “Clean file system”,* press enter.

![](https://miro.medium.com/v2/resize:fit:819/1*9nO0HXSnujqDodcXBqVByA.png)

Now we can run the command *$task.Actions* to let us see what will execute when we run this program. Press enter to run the command, and get your answer.

![](https://miro.medium.com/v2/resize:fit:824/1*8e-_ev8uCgCFhI2gwuESlA.png)

## 8. What port did this file listen locally for?

### របៀបធ្វើ

For this answer look at the output from the previous question and the port is right above it, in the *Arguments* column.

![](https://miro.medium.com/v2/resize:fit:824/1*eJ9SftiD8NZLfR_7Lr2cZg.png)

## 9. When did Jenny last logon?

### របៀបធ្វើ

We ran this command before but can run it again to pull the info back up. The command is *net user Jenny | findstr “Last”*. Press enter to run the command and get the answer to this question.

![](https://miro.medium.com/v2/resize:fit:511/1*944zlI8eRah68hmHZ1TwPQ.png)

## 10. At what date did the compromise take place?

### របៀបធ្វើ

Click on the *File Explorer* icon on the taskbar to open up File Explorer. When the window pops-up, click on *Local Disk(C:)*.

![](https://miro.medium.com/v2/resize:fit:618/1*dZ9bKhnYIK9OcoTpS4X_hQ.png)

You will be inside the *C* folder now, looking at the folders you will see a date that sticks out. You should also see a Folder that doesn’t belong in here. The date that pops up several times is the answer. Remember when typing the answer over into THM to put a zero in front of the month and day.

![](https://miro.medium.com/v2/resize:fit:629/1*bJHfo08Y8y_vUSaCizqadw.png)

## 11. At what time did Windows first assign special privileges to a new logon?

### របៀបធ្វើ

Go to the *Start Menu* icon, click on it and then click on *Event Viewer* on the pop-up menu.

![](https://miro.medium.com/v2/resize:fit:795/1*up0AmBQHiipVygFnMnpVRw.png)

Since what we are looking for is a security issue, we will look into the security logs first to see if we find what we are looking for. But knowing that there are going to be a lot of them, we need to narrow them down. To do this, click on *Create Custom View* on the right side of the Event Viewer Window.

![](https://miro.medium.com/v2/resize:fit:488/1*PMWnTDSK-vR-XH4bD4Fl1g.png)

A pop-up window will appear, start off by clicking on the *Logged* field will have a drop-down box appear. Click on _Custom Range…
![](https://miro.medium.com/v2/resize:fit:676/1*Qc-P3hQlc-ingSwDkfJ5bA.png)

In the *From:* section click where it says *First Event*, and then click *Events On* from the drop down menu. Do the same thing in the *To:* section.

![](https://miro.medium.com/v2/resize:fit:231/1*_ByhvJt7RY5rM1y95QN_CQ.png)

From previous questions, we know that the day is March 2, 2019, so we can put in that day. From the last question, we know a rough time of when the attack happened, so you can put 4:00:00 PM — 4:30:00PM. Once the date fields are filled out, then click the *OK* button in the bottom of the window.

![](https://miro.medium.com/v2/resize:fit:563/1*JCi0a44pAK7A0xv8cF4RjA.png)

Now we have to choose the log we want to look through. To do this click on the *Event Logs:* field, when the drop-down appears click the small + next to *Windows Logs*, then finally click on *Security*. This will select this log.

![](https://miro.medium.com/v2/resize:fit:564/1*s9V5umI-bqwqUmMdQqM6Vg.png)

Click *OK* at the bottom of the Create Custom View Window.

![](https://miro.medium.com/v2/resize:fit:681/1*mzJIxSW95hgdh3CzTR0GLQ.png)

A Window will pop-up to Save the Filter and ask you to name it, just click the *OK* button on the right side of the Window.

![](https://miro.medium.com/v2/resize:fit:489/1*JsYlfwnNvKZ5bhAPBRI2kw.png)

We have 297 Events to look through, let us start at the beginning. On the right side of the Number of events, scroll down to the bottom.

![](https://miro.medium.com/v2/resize:fit:875/1*lyCIrU1SYlcfK61j5ryiug.png)

Once at the bottom, you can slowly start to scroll up, as you do look at the *Task Category*. This will indicate what we are looking for, which is privilege changes to a new logon. You are looking for *Security Group Management*, once you find that, look to the Date and Time for the answer. Just make sure you put a zero before the month and day in the answer.

![](https://miro.medium.com/v2/resize:fit:875/1*yNxjrkFc1VxWfHbtVv2P1g.png)

## 12. What tool was used to get Windows passwords?

### របៀបធ្វើ

A command prompt keeps poping up with *C:\TMP\mim.exe*, this gives us a place to look into for a possible tool that is being used.

![](https://miro.medium.com/v2/resize:fit:215/1*XDGBfC34mMqg-tq6GK_gYQ.png)

Click on the *File Explorer* icon on the taskbar at the bottom of the screen. Once the File Explorer window pops up click on the *Local Disk (C:)* to open this directory.

![](https://miro.medium.com/v2/resize:fit:755/1*i3NVLdsOIFWyWjxfmuKaYA.png)

Double-click on the *TMP* directory.

![](https://miro.medium.com/v2/resize:fit:539/1*PPXShXt_YhuXGBzB718PLw.png)

Once inside this directory, you will see several files, word docs, and powershell commandlets. If we look for the Application named *mim.exe*, like we keep seeing pop up, under it is a word document called *mim-out*. This could be related to the application, so let us open it and see. Double-click on *mim-out*.

![](https://miro.medium.com/v2/resize:fit:511/1*wTyjk-j_JAk2eGXX-jedzw.png)

When mim-out opens, you should see the name of a tool that you should have knowledge of.

![](https://miro.medium.com/v2/resize:fit:801/1*c_AkrUIewFDUEQQ5he-nsQ.png)

Answer: mimkatz

## 13. What was the attackers external control and command servers IP?

### របៀបធ្វើ

Now let us head back to the host file, to start go back the *Up Arrow* next to the directory path field, and click on it. This will move you up one directory.

![](https://miro.medium.com/v2/resize:fit:431/1*5GvgGX0lpYrWfnH0-JKuOw.png)

Follow this file path to get to the host file, *C:\ > Windows > System32 > drivers > etc*, once there double-click on *hosts* to open it.

![](https://miro.medium.com/v2/resize:fit:613/1*syJ_w_c01HktWMCkPbV1xg.png)

a window will pop up with *How do you want to open this file?*. Click on *Notepad*.

![](https://miro.medium.com/v2/resize:fit:491/1*I-OEUDApYRh0ag_Tz_aJXA.png)

Inside this file, we see that google.com and www.google.com is in here. That is very sus since we shouldn’t need to put that in the host file, it can be found by the PC going to the DNS server. The threat actor might be hiding their C2 server IP this way. We can check by opening command promt on our host machine, and pinging Google.com. If it matches this host file then it is legit if not then it is sus.

![](https://miro.medium.com/v2/resize:fit:875/1*2uiBKvG8DEOXikDHMe98uA.png)

It doesn’t match the host file which means that, it is most likely the C2 server IP, type this into TryHackMe as the answer. Leave this file open as you will need something else from it for another answer.

![](https://miro.medium.com/v2/resize:fit:726/1*ye0iVvvc0itmNfdqZbQC6Q.png)

## 14. What was the extension name of the shell uploaded via the servers website?

### របៀបធ្វើ

Now we are going to check another suspicious directory, if you go back to the File Explorer Window, on the left side of the window is a Quicklinks section that we can access different directorys quickier. Look for *Local Disk (C:)*, under it should be the directory we are looking for, it is *inetpub*, click on it go right to that directory.

![](https://miro.medium.com/v2/resize:fit:220/1*iXFiZlvWL7pVRr-7GQ7mTg.png)

Inside this directory is another directory named *wwwroot*, click on it to go into this directory.

![](https://miro.medium.com/v2/resize:fit:714/1*IrSsqlpNL2dkfvCiaS0Sww.png)

Now inside this directory we can see three files, two of which is .JSP files and the other is a .GIF file. The .GIF file isn’t super suspicious on a computer, but what is a .JSP file? With a quick google search we find out.

![](https://miro.medium.com/v2/resize:fit:875/1*8SnaKz3ErJjqG9bHaWmZWA.png)

So what is a Java file doing here, this seems like it could be the file extention we are looking for. In the question it does say what is the extention of the shell uploaded, but they are talking about the two other files.

![](https://miro.medium.com/v2/resize:fit:718/1*-3creQg2E64XHlTzvplVkA.png)

## 15. What was the last port the attacker opened?

### របៀបធ្វើ

A good way to find out about opened ports is to check out the firewall logs. to access this you can click on the *Start Icon* in the bottom left of the screen, then type *firewall,* then click on or press enter on the only entry.

![](https://miro.medium.com/v2/resize:fit:615/1*ir8xCh7ieU7P44jcUjlk4Q.png)

The Windows Firewall and Advanced Security window will pop-up, when it does, click on the *Inbound Rules* in the left hand side. This will show a lot of inbound rules.

![](https://miro.medium.com/v2/resize:fit:395/1*guA9lA0QUiWwXLweuHxJVg.png)

Let us filter out most of these to find what we are looking for, go to the column on the right hand side. Click on *Filter by Group,* then scroll to the bottom of the drop-down menu, click on *Rules without a Group.*

![](https://miro.medium.com/v2/resize:fit:875/1*8_oFtbXdXjUB_T5DDJZz4g.png)

You now only have two results, one of them seems very sus. Double click on the first entry, *Allow outside connections for development*.

![](https://miro.medium.com/v2/resize:fit:875/1*k9vYzCPjzu7QKWt3m_jVow.png)

A window will pop-up giving details about this rule, look for the tab labeled *Protocols and Ports* and click on it.

![](https://miro.medium.com/v2/resize:fit:676/1*f33SFluU04s7w5BzbPAV_w.png)

Now in here you will see the port that is opened, this is the answer to the question.

![](https://miro.medium.com/v2/resize:fit:673/1*QZZwUQwncZHZNsnswHU0jA.png)

## 16. Check for DNS poisoning, what site was targeted?

### របៀបធ្វើ

Go back to the hostfile that you left open, if you didn’t follow the instructions above to get to the host file. Remember when I said about a certain website being in the host file that could easliy be found on the dns server. That same website being linked to the C2 server. That is the answer to this question.

![](https://miro.medium.com/v2/resize:fit:875/1*-TTCPDRzR7ehIRtH2xvzOg.png)

# ចប់​។ អរគុណសម្រាប់ការអាន
