---
title: Using `parallel` to speed up loops
description: Using GNU parallel is better than for loops in bash scripts
---
Good morning, fellow bioinformatics peeps.

I want to share a new technique I've recently learned that has sped up some of my scripts on the HPC significantly. Anywhere that I would normally use a for loop, I am now using the GNU parallel utility instead.¹

Here are the results of a pseudo-experiment I ran to quantify its benefit:

I started with a simple loop to run a bwa mem alignment on 5 samples downloaded from NCBI. This is how I have done loops in the past and have seen everyone else mostly use them:

```
for samplename in "SRR518710" "SRR518711" "SRR518712" "SRR518713" "SRR518717"
do
   bwa mem arctos.fna.gz ${samplename}_1.fastq ${samplename}_2.fastq > test_${samplename}.mapped.sam
done
```

This loop will run the `bwa mem` command one at a time until all 5 samples have been processed. It took me an average of 31 minutes, 6 seconds to run this entire script (the SRR files used were intentionally small for testing purposes. CPU efficiency 90%; memory efficiency 14%).²

A better way to do this would be to have each of the five bwa mem commands running simultaneously instead of one after the other. As we discussed in Bioinformatics Club, one way to do this is by appending an & character to the end of the command. Here is what that looks like:

```
for samplename in "SRR518710" "SRR518711" "SRR518712" "SRR518713" "SRR518717"
do
   bwa mem arctos.fna.gz ${samplename}_1.fastq ${samplename}_2.fastq > test_${samplename}.mapped.sam &
done
```

This speeds things up significantly. It took an average of 27 minutes, 1.8 seconds to run this script, which is about a 13% decrease in runtime (Memory use was much higher than the first method: 95% CPU efficiency, 66% memory efficiency).

However, we can make this even faster using the parallel utility. Here is how that looks:

```
module load parallelgnu
parallel "bwa mem arctos.fna.gz {}_1.fastq {}_2.fastq > test_{}.mapped.sam" ::: "SRR518710" "SRR518711" "SRR518712" "SRR518713" "SRR518717"
```

Using this utility, it took me an average of 24 minutes, 11 seconds to run this script. That is another 10% decrease in runtime (22% decrease in total compared to the first method). Plus, in my opinion, the code ends up a bit cleaner. As an added bonus, memory usage is lower using this method than the second method using & (27% memory efficiency, 94% CPU efficiency).

Here is an article that explains what the parallel utility is doing and why it is so much faster: https://www.biostars.org/p/63816/

Feel free to shoot me a message if you have any questions or want any assistance refactoring your scripts to use this utility.

<sub>¹Note that you will only get results like I describe here when you have more processes running than CPUs available. In the examples here, there are 5 commands running in parallel but I only allocated 2 CPUs. So this technique is really only a benefit when you have many items in your loop. But in those cases it is a huge benefit. It also doesn't hurt anything if you have only a couple items in your loop, so you may as well just use it all the time. If you have the default of --cups-per-task 1 all three of the methods here will have roughly the same runtime.</sub>

<sub>²The settings for all three of these methods were the same: 1 node, 2 CPUs, 48G mem, computeq partition. Averages were calculated from 5 runs of the script.</sub>