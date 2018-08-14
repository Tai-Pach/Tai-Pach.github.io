---
title: "Train/Test Splits Made Simple"
layout: post
categories: R
output: kramdown
featured_image: /images/train-test/split.jpg
---

This is less of a blog post and more of a data science life hack.  I am all for making common routines easier, so when I stumbled upon this easy way to create train/test splits I thought I would share.

The package you will need is `gradDescent`

First, read in your dataset
```r
library(data.table)
library(gradDescent)

df <- fread("your_dataset.csv")
```

`gradDescent` has a a great function called `splitData()`
Its arguments include:
* The dataset
* dataTrainRate
* seed 

`dataTrainRate` controls what percentage of the data becomes training data and what percentage becomes test data.

So setting the dataTrainRate to 0.8 creates a 80/20 train/test split.

```r
split_df= splitData(df, dataTrainRate = 0.8, seed = NULL)
```
Extract dataTrain and dataTest from the split_df and save them to varibles:

```r
splitTrain = splitedDataset$dataTrain
splitTest = splitedDataset$dataTest
```
And that's it!  Just make sure you remove the column from the testset you want to predict on. 

All in all, it's a little less complicated than say:

```r
set.seed(15)
index <- 1:nrow(df)
testindex <- sample(index, trunc(length(index)/3))

testset <- df[testindex,]
trainset <- df[-testindex,]
```  
