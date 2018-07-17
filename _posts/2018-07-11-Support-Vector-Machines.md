---
title: "Support Vector Machines in Action"
layout: post
categories: R
output: kramdown
featured_image: /images/svm/svm.png
---

The Maximal Margin Classifier algorithm is a way of classifying observations using (1) hyperplanes to segment clusters and (2) maximal margin classifiers to control classification sensitivity.  The width of the hyperplane's maximal margin is dependent on observations that fall closest (equidistant) to the hyperplane.  This is known as a "hard" margin.  There are no observations between the hyperplane and the margin. It's a powerful classification tool but it does have its limitations.

1.  Maximal margin classifiers are extremely sensitive to outliers.  An addition of a single observation can change the hyperplane
2.  This high sensitivity to small changes implies that our classifier can cause overfitting

To remedy this, we turn to support vector classifiers.  SVCs force us to take a penalty to perfect classification of support vectors in return for lower hyperplane sensitivity to outliers and better classification of the rest of the observations.  SVCs implement a soft margin--the margin is called *soft* because some observations are allowed to fall on the wrong side of the margin or even the hyperplane itself.  We introduce two new variables epsilon and C.

epsilon is a slack variable--it allows observations to fall on the wrong side of margin or the hyper plane.

* if epsilon is =0 the observation falls on the correct side of the margin and the hyperplane
* if epsilon is >0 but <1 the observation violates the margin but not the hyperplane
* if epsilon is >1 the observation violates the hyper plane

C is tuning parameter--it helps govern the threshold of violations that the margin and hyperplane can tolerate.  As gamma increases, there is more budget for violations (the margin widens).  As gamma decreases, there is less budget for violations (the margin narrows)

The support vector classifier fails when the boundary between classes is no longer linear.  This is where support vector machines come in.  The SVM is an extension of the SVC by enlarging feature space using kernels.  A kernel is a essentially a function applied to the observations that thereby enlarge the feature space while preserving the observations relationship to one another.

In my understanding (I could be totally wrong), a hyperplane cannot cross itself (it cannot be fully radial even though there is such thing as a radial kernel).  This is because a kernel is a function and function can only have one output per input.  

As the complexity of a kernel increases (and affects how the hyperplane folds in feature space), it becomes increasingly harder to *explain* how the data is being classified and we can run into the problem of overfitting the data.

Even SVMs have their limitations too: Classification becomes increasingly more computationally expensive as the number of observations increases.  You are literally having the computer calculate the dot product of all possible point pairs. Also, SVMs don't handle applications past binary classification very well.  To remedy this shortcoming, we can use 1v1 classification or 1v"All" classification.

1v1:  construct a svm for each pair of features
1vall: construct a svm for each individual feature vs all other features combined.

# SVM implementation in R: ####

libsvm in the e1071 library allows us to use train a SVM model for use on test data.  I am using the dataset I generated from my [Kelley Blue Book project](https://tai-pach.github.io/kbb).  I will use `svm()` to predict the type of car body (sedan, SUV, convertible, etc.) from a set of features:

```r
library(e1071)
library(data.table)
library(dplyr)
```
```r
df = fread('KBB_used_final_3.csv')

#select the features to predict body tupe:
subset = df %>% select(body ,price, mileage, year, city_mpg, highway_mpg, gas_combined_mpg, transmission, doors, engine)

#Factorize categorical varibles:
subset$body = as.factor(subset$body)
subset$transmission = as.factor(subset$transmission)
subset$doors = as.factor(subset$doors)
subset$engine = as.factor(subset$engine)

#omit NA values
subset = na.omit(subset)
#########################
#####Train the model#####
#########################
set.seed(42)
index <- 1:nrow(subset)
testindex <- sample(index, trunc(length(index)/3))

testset <- subset[testindex,]
trainset <- subset[-testindex,]

svm.model <- svm(body ~ . , data = trainset, cost = 100, gamma = 1)

#Test the model on the test set
svm.pred <- predict(svm.model, testset[,-1])


#create a confusion matrix
table(pred = svm.pred, true = testset$body)

#generate a data table of predicted vs. actual body types
x= data.frame(svm.pred)
y = data.frame(testset[,1])
prediction = cbind(x,y)

#calculate the number of misclassified body types
sum(prediction[,1]!=prediction[,2])
```
The confusion matrix revealed that the most misclassifcations occured between the Hatchback and Sedan body types:
			   true
pred            Convertible Coupe Hatchback Sedan Sport Utility Truck  Van Wagon
  Convertible            98    44        13     0             1     3    0     0
  Coupe                  60   255         8     0             0     5    0     0
  Hatchback              12    10       301    51             8     1    1     5
  Sedan                   9    18       117  1972            70    10    9    23
  Sport Utility           0     0         2    47          1559    66   27    19
  Truck                   1     2         1     0            42   236    1     0
  Van                     0     0         2    15            27     2  170     3
  Wagon                   1     0        10    30            11     0    0   114




The first 50 rows of my final table looked like this:

<iframe src="/htmlwidgets/svm/table1.html"></iframe> <a href="/htmlwidgets/svm/table1.html" target="_blank">open</a>

My SVM model was able to classify car body type using the features I selected with 85.7% accuracy