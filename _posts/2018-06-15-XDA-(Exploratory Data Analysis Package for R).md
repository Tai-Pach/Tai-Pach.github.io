---
title: "XDA (Exploratory Data Analysis Package for R)"
layout: post
categories: R
output: kramdown
featured_image: /images/xda/xda.png
---

## "XDA"-package: EDA made easy####
One of my current favorite packages in R is "XDA".  This package allows you to get an itial glimpse at some the stats within your dataset.  You can read more about it and install it [here!](https://github.com/ujjwalkarn/xda).  In this blog, I will show you how xda works in action. 


## Getting Started ####

Let's load in the necessary libraries.  I will use the Kelley Blue Book Used Car dataset I generated in my [Kelley Blue Book project](https://tai-pach.github.io/kbb/).  This data set has about 17000 observations of used cars for sale on kbb.com in May 2018.


The XDA package comes with 5 handy functions:

* ```numSummary(mydata)``` function automatically detects all numeric columns in the dataframe mydata and provides their summary statistics
* ```charSummary(mydata)``` function automatically detects all character columns in the dataframe mydata and provides their summary statistics
* ```Plot(mydata, dep.var)``` plots all independent variables in the dataframe mydata against the dependant variable specified by the dep.var parameter
* ```removeSpecial(mydata, vec)``` replaces all special characters (specified by vector vec) in the dataframe mydata with NA
* ```bivariate(mydata, dep.var, indep.var)``` performs bivariate analysis between dependent variable dep.var and independent variable indep.var in the dataframe mydata


Let's put these functions to work on a dataset.
```r
library(data.table)
library(XDA)
library(dplyr)

df = fread('kelleybluebook.csv')
```

A preview of the dataset:

```r
head(df)
```

<iframe src="/htmlwidgets/xda/table_1.html"></iframe> <a href="/htmlwidgets/xda/table_1.html" target="_blank">open</a>


And now the fun part: Seeing what insights the data holds.
Let's use the ```numSummary()``` function to get statistical information on our numerical features

```r
numSummary(df)
```
<iframe src="/htmlwidgets/xda/table_2.html"></iframe> <a href="/htmlwidgets/xda/table_2.html" target="_blank">open</a>

Column Legend (taken from XDA github):

```
n= total number of rows for that variable
nunique = number of unique values
nzeroes = number of zeroes
iqr = interquartile range
noutlier = number of outliers
miss = number of rows with missing value
miss% = percentage of total rows with missing values ((miss/n)*100)
5% = 5th percentile value of that variable (value below which 5 percent of the observations may be found): The percentile values are helpful in detecting outliers
```
The ```numSummary()``` selects all of the numerical features in our dataset and returns useful information like mean, mode, sd, number of missing observations, and percent missingness.  *But what's great about this function is that it also returns the number of outliers in our features!*  For example, there are 226 outliers in our "price" column.  This is very handy for preparing our data for predictive models or clustering.  The percentile columns gives us a glimpse into how data is distributed for a feature.  For example, 99% of our observations for "price" can be found below $64,900!  Super handy!  


The less useful charSummary() function can provide us some insight into features of type character.

```r
xda::charSummary(df)
```

<iframe src="/htmlwidgets/xda/table_3.html"></iframe> <a href="/htmlwidgets/xda/table_3.html" target="_blank">open</a>


This function returns missingness information, the count for the top 5 levels of that feature, and the total number of unique "categories" for each categorical feature.  The latter can be useful when deciding whether to convert a character-type feature to factor-type.  For example, "doors", "body", and "condition" would be good features to factorize.


Here we see that the Honda Civic LX Sedan is the most frequent make and model being sold.  "Charcoal"" is the most frequent car color, "6-Speed Shiftable Automatic" is the most frequent transmission and so on.

*Not as useful as ```numSummary()``` but still handy!*

I hope you enjoyed this brief look at XDA.  Consider trying it out for yourself!




