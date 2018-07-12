---
title: "Support Vector Machines in Action"
layout: post
categories: R
output: kramdown
featured_image: /images/svm/svm.png
---

The Maximal Margin Classifier algorithm is a way of classifying observations using (1) hyperplanes to segement clusters and (2) maxial margin classifiers to control classification sensitivity.  The width of the hyperplane's maximal margin is dependent on observations that fall closest (equidistant) to the hyperplane.  This is known as a "hard" margin.  There are no obersvations between between the hyperplane and the margin. It's a powerful classification tool but it does have its limitations.

1.  Maximal margin classifiers are extremely sensitve to outliers.  An addition of a single observation can change the hyperplane
2.  This high sensitivity to small changes implies that our classifier can cause overfitting

To remedy this, we turn to support vector classifiers.  SVCs force us to take a penalty to perfect classification of support vectors in return for lower hyperplane sensitivity to outliers and better classification of the rest of the observations.  SVCs implement a soft margin--the margin is called *soft* because some observations are allowed to fall on the wrong side of the margin or even the hyperplane itself.  We introduce two new varibles epsilon and C.

epsilon is a slack variable--it allows observations to fall on the wrong side of margin or the hyper plane.

* if epsilon is =0 the observation falls on the correct side of the margin and the hyperplane
* if epsilon is >0 but <1 the observation violates the margin but not the hyperplane
* if epsilon is >1 the observation violates the hyper plane

C is tuning parameter--it helps govern the threshold of violations that the margin and hyperplane can tolerate.  As gamma increases, there is more budget for violations (the margin widens).  As gamma decreases, there is less budget for violations (the margin narrows)

The support vector classifier fails when the boundary between classes is no longer linear.  This is where support vector machines come in.  The SVM is an extension of the SVC by enlarging feature space using kernels.  A kernel is a essentially a function applied to the observations that thereby enlarge the feature space while preserving the observations relationship to one another.

In my understanding (I could be totally wrong), a hyperplane cannot cross itself (it cannot be fully radial even though there is such thing as a radial kernel).  This is because a kernel is a function and function can only have one output per input.  As the complexity of a kernel increases (and affects how the hyperplane folds in feature space), it becomes increasingly harder to *explain* how the data is being classified and we can run into the problem of overfitting the data.

Even SVM have their limitations too: Classification becomes increasingly more computationally expensive as the number of observations increases.  You are literally having the computer calculate the dot product of all possible point pairs. Also, SVMs don't handle applications past binary classification very well.  To rememdy this shortcoming, we can use 1v1 classification or 1v"All" classification.

1v1:  construct a svm for each pair of features
1vall: construct a svm for each individual feature vs all other features combined.



