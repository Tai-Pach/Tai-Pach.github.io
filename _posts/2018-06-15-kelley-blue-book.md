---
title: "Kelley Blue Book Project"
layout: post
categories: R
output: kramdown
featured_image: /images/projects/kbb.png
---

## Introduction ####
When you purchase a brand new car, the manufacturer's suggested retail price, the MSRP, is predetermined.   But when you sell your car, and ownership of the vehicle changes hands, how do you determine what the car is worth?  Most likely you go Kelley Book or CarFax to get an appraisal of your car.   There are many factors that contribute to a car's value, from mileage to engine type.  In this project I will show you how you can estimate a car's worth from data gathered from scratch! The workflow looks like this:

  1. Scrape Kelley Blue Book's used car listings using a Python scripts
  2. Data Cleaning
  3. Feature Engineering
  4. Exploratory Data Analysis
  5. Designing a predictive model
  
## Part I: Collecting The Data ####
For any data scientist enthusiast, web scraping is a valuable.  Most of the time  data scientists work with prepared datasets: Perhaps they are supplied by employers, clients, or by dataset hosts like Kaggle.  But for the ever curious data scientist, collecting unstructured data can be a worthwhile venture.  Scraping the web for data can be tricky but Scrapy, a Python based program, makes the process much easier.  Here I will show you how to scrape KBB.com for used car listings.

```r
knitr::opts_chunk$set(echo = TRUE)
```

## How Scrapy Works ####
Scrapy allows you to program a bot (i.e. a Python script) that collects whatever data you want from a webpage.  Although I won't go in to depth about all the code a Scrapy bot requires, I will outline key points in Scrapy bot design.

1.  Initialize a Scrapy bot directory
    . Starting a Scrapy project is easy: After installing Scrapy got to your Python terminal (such as Anaconda Prompt) and         type: 
    ```scrapy startproject <Name of Project>```
    This will create a Scrapy directory folder with all the files you need to start web scraping
2.  Setup the "Items.py" Script
    . This script tells the bot what elements of a website you want to scrape
    . For this project I want to scrape the details about the used car that is being listed

```python
import scrapy


class KbbItem(scrapy.Item):
	car = scrapy.Field()
	mileage = scrapy.Field()
	price = scrapy.Field()
	color = scrapy.Field()
	transmission = scrapy.Field()
	engine = scrapy.Field()
	doors = scrapy.Field()
	body = scrapy.Field()
	mpg = scrapy.Field()
	kbb_expert_review = scrapy.Field()
	consumer_review = scrapy.Field()
	location = scrapy.Field()
	website = scrapy.Field()
```

3.  Setup the "Spider.py" script
    . This is the brain of the bot.  The Spider script essentially "crawls" the webpage and collects the data you assigned in       the Items script.  This is a hefty script!  I will save the explanation of this code for a blog post.
    
```python
from scrapy import Spider, Request
from kbb.items import KbbItem
import re


class kbbSpider(Spider):
	#name: an attribute specifying a unique name to identify the spider
	name = "kbb_spider"
	#start_urls: an attribute listing the URLs the spider will start from
	allowed_domains = ['www.kbb.com']
	#allowed_urls: the main domain of the website you want to scrape
	start_urls = ['https://www.kbb.com/cars-for-sale/cars/used-cars/?p=1&color=']
	#parse(): a method of the spider responsible for processing a Response object downloaded from the URL and returning scraped data (as well as more URLs to follow, if necessary)
	def parse(self, response):
		text = response.xpath('//*[@id="listingsContainer"]//span[@class="page-numbers"]/text()').extract()[1]

		result_pages = ['https://www.kbb.com/cars-for-sale/cars/used-cars/?p={}&color={}'.format(x,y) for x in range(1, int(text)+1) for y in ['beige', 'black', 'blue', 'brown', 'burgundy','charcoal','gold','gray','green','offwhite','orange','pink','purple','red','silver','tan', 'turquoise','white','yellow']]

		for url in result_pages:
			yield Request(url=url, callback=self.parse_result_page)

	def parse_result_page(self, response):

		products = response.xpath('//*[@id="listingsContainer"]//a[@class="js-vehicle-name"]/@href').extract()
		product_urls = ['https://www.kbb.com' + x for x in products]


		for url in product_urls:
			yield Request(url=url, callback=self.parse_product_page)

	def parse_product_page(self, response):

		car = response.xpath('//*[@id="vehicleDetails"]/div/div/h1/text()').extract_first()
		price = response.xpath('//*[@id="pricingWrapper"]/span/span[@class ="price"]/text()').extract_first()
		mileage = response.xpath('//*[@id="keyDetailsContent"]/div/div/div/ul/li[@class="js-mileage"]/text()').extract_first()
		color = response.xpath('//*[@id="keyDetailsContent"]//li[contains(text(),"Exterior Color:")]/text()').extract_first()
		transmission = response.xpath('//*[@id="keyDetailsContent"]//li[contains(text(),"Transmission:")]/text()').extract_first()
		engine = response.xpath('//*[@id="keyDetailsContent"]//li[contains(text(),"Engine:")]/text()').extract_first()
		doors = response.xpath('//*[@id="keyDetailsContent"]//li[contains(text(),"Doors:")]/text()').extract_first()
		body = response.xpath('//*[@id="keyDetailsContent"]//li[contains(text(),"Body Style:")]/text()').extract_first()
		mpg = response.xpath('//*[@id="keyDetailsContent"]//li[contains(text(),"Fuel Economy:")]/text()').extract_first()
		drive_type = response.xpath('//*[@id="keyDetailsContent"]//li[contains(text(),"Drive Type:")]/text()').extract_first()
		kbb_expert_review = response.xpath('//*[@id="readExpertReview"]/p/span[@class="title-three"]/text()').extract_first()
		consumer_review = response.xpath('//*[@id="readConsumerReview"]/p/span[@class="title-three"]/text()').extract_first()
		location = response.xpath('//*[@id="aboutTheDealer"]//p/text()').extract()[:2]
		website = response.xpath('//*[@id="dealerDetailsModuleWebsite"]/@href').extract_first()

		item = KbbItem()
		item['body'] = body
		item['mpg'] = mpg
		item['kbb_expert_review'] = kbb_expert_review
		item['consumer_review'] = consumer_review
		item['car'] = car
		item['price'] = price
		item['mileage'] = mileage
		item['color'] = color
		item['transmission'] = transmission
		item['engine'] = engine
		item['doors'] = doors
		item['location'] = location
		item['website'] = website
		yield item
```

4.  Setup the "pipelines.py" script
    . This script tells the bot how you want to save the data it collects.  CSV format? Text file? It's up to you!
    
```python
from scrapy.exceptions import DropItem
from scrapy.exporters import CsvItemExporter

class ValidateItemPipeline(object):
	def process_item(self, item, spider):
		if not all(item.values()):
			raise DropItem("Missing values!")
		else:
			return item

class KbbPipeline(object):
	def __init__(self):
		self.filename = 'kbb2.csv'
	def open_spider(self, spider):
		self.csvfile = open(self.filename, 'wb')
		self.exporter = CsvItemExporter(self.csvfile)
		self.exporter.start_exporting()
	def close_spider(self, spider):
		self.exporter.finish_exporting()
		self.csvfile.close()
	def process_item(self, item, spider):
		self.exporter.export_item(item)
		return item
```

5. Setup the "settings.py" script
    . This script controls the settings of the bot like how fast should the bot scrape. You can change these settings here.
    
```python
BOT_NAME = 'kbb'
SPIDER_MODULES = ['kbb.spiders']
NEWSPIDER_MODULE = 'kbb.spiders'
ROBOTSTXT_OBEY = True
DOWNLOAD_DELAY = 0.5
ITEM_PIPELINES = {
    'kbb.pipelines.KbbPipeline': 300,
}
```

That's it! Now navigate to your Python command line and enter: ```scrapy crawl <name of spider>```
The spider bot will begin to crawl the site, collect the items you specified, and save them in a predetermined format in the root of your project directory!

## Part II: Cleaning the Data ####
When you finish your scraping chances are the data will not be ready for exploration.  Here are some of the issues I had to address before I began my EDA.

  1. Removing spaces, tabs, symbols, etc. from my data
  2. Removing unnecessary strings from my data.  For example: removing "Mileage: " from mileage data
  3. Converting columns of data into the correct data type. (e.g. changing characters to numeric type)
  4. The MPG feature has too much data per cell.  "City/Highway/Combined/MPGe".  I chose to split this column into four columns:
  5. Creating new columns for make and model, year built, and car condition
  6. Filling blank columns with 'NA'
  

## Part III: Feature Engineering ####
Feature engineering involves creating new columns of data from existing features.  For example: Taking a column of U.S. states and making a new column called Regions based off the states location, so that Connecticut would have the value "Northeast"" and Oregon would be "Northwest".

I did not employ feature engineering for this project but I may in the future

## Part IV: Exploratory Data Analysis ####
```r
library(data.table)
library(highcharter)
library(dplyr)

df = fread('C:/Users/pache_000/Desktop/kbb/kbb_used_final_3.csv')
```

A preview of the dataset:
```r
head(df)
```

And now the fun part: Seeing what insights the data holds
one of my favorite R packages for EDA is "XDA".  Let's use the ```numSummary()``` function to get statistical information on our numerical features

```r
library(xda)

numSummary(df)
```
Column Legend (taken from XDA github):

```
n= total number of rows for that variable
nunique = number of unique values
nzeroes = number of zeroes
iqr = interquartile range
noutlier = number of outliers
miss = number of rows with missing value
miss% = percentage of total rows with missing values ((miss/n)*100)
5% = 5th percentile value of that variable (value below which 5 percent of the observations may be found)
. the percentile values are helpful in detecting outliers
```

This function is very useful for detecting the amount of outliers in a feature.

The less useful charSummary() function can provide us some insight into charater-type features.

```r
xda::charSummary(df)
```
Here we see that the Honda Civic LX Sedan is the most frequent make and model being sold.  "Charcoal"" is the most frequent car color, "6-Speed Shiftable Automatic" is the most frequent transmission and so on.

## Brand and Car Body Break Down ####
Now that we have collected about 17,000 used car details from KBB.com, let's see what brands dominate used car listings.

```r
brand_count = df %>% select(., brand) %>% group_by(., brand) %>% summarise(., count = n())

hchart(brand_count, "treemap", hcaes(x = brand, value = count, color = count, height = 1080)) %>% hc_title(., text= "Brand Treemap")
```
Of all the cars I collected (your results may vary), the most frequent brands were Ford, Chevy, Toyota and Honda.

```r
body_count = df %>% select(., body) %>% group_by(., body) %>% summarise(., count = n())

hchart(body_count, "treemap", hcaes(x = body, value = count, color = count, height = 1080)) %>% hc_title(., text= "Car Body Treemap")
```
Sedan and Sport Utility vehicles are very frequent in used car listings.  

## Customer Reviews vs KBB Expert Reviews ####
Let's take a look at how ratings between car owners and Kelley Blue Book experts differ.

```r
hchart(density(na.omit(df$consumer_review)), type = "area", color = "#B71C1C", name = "Consumer Review")%>% hc_add_series(density(na.omit(df$kbb_expert_review)), area = TRUE, name = "KBB Expert Review") %>% hc_add_theme(hc_theme_db()) %>% hc_title(., text = "Customer Ratings vs Expert Ratings")
```

Here we can see that consumers are a little more lenient in how they rate a car and will give a car higher marks while experts seem to be more critical.

## How Mileage Affects Price ####
```r
mileage_price = df %>% select(., mileage, price, body) %>% filter(., body =="Sedan"|body =="Sport Utility")
hchart(mileage_price, "scatter", hcaes(x = mileage, y = price, group=body)) %>% hc_title(., text = "How Mileage Affects Price for Sedans and Sport Utility Vehicles")  %>% hc_add_theme(hc_theme_db())
```
Just as we would expect, as a car's mileage increases its price decreases. Convertibles, coupes and luxury vehicles make up most of our outliers and they are skewing the data.  For that reason, I chose to exclude them and only include the most frequent body types being sold: Sedans and Sport Utility Vehicles.

## Price, Mileage and Year Distributions ####
```r
hchart(df$price, name = "Price") %>% hc_title(., text = "Price Distribution")  %>% hc_add_theme(hc_theme_db())
```

Most cars are priced between \$11k to \$13k.  There is a substantial drop of in cars valued over \$15k.  Some luxury vehicles selling over $450,000 are outliers and need to be removed for predictive modelling.  (*Try zooming in*)   

```r
hchart(df$mileage, name = "Mileage") %>% hc_title(., text = "Mileage Distribution")  %>% hc_add_theme(hc_theme_db())
```

Most cars have mileages between 15,000-30,000 miles.    


```r
hchart(df$year, name = "Year") %>% hc_title(., text = "Car Year Built Distribution")  %>% hc_add_theme(hc_theme_db())
```

Here we see something interesting.  Most cars being sold were built in 2015: They are only three years old.  Why is this? Accoriding to Edmunds Used Car Report "24% of franchise used sales were 3 years old in Q1 2018".  Once a three year lease is up, many owners look to sell their car, causing a market saturation of 3-year old cars.  



