setwd("/Users/tbecker/Documents/Projects/GitHubProjects/BCGMap/data")
library(dplyr)
library(rgdal)
library(OpenStreetMap)

BCG<-read.csv("FishBug_2018AssessmentData.csv",header=TRUE)
sites<-read.csv("sitesDB.csv",header=TRUE)


AvgBCG<- BCG %>%
  group_by(STA_SEQ,SAMPLE) %>%
  summarise(AvgBCG=mean(METRIC_VALUE),CntBCG=n())%>%
  as.data.frame()

AvgBCG<- merge(AvgBCG,sites,by.x="STA_SEQ")

uniqsites<-as.data.frame(unique(AvgBCG$sites))

#Make sure coordinates are numeric.  Create a SpatialPointsDataFrame
AvgBCG$YLat  <- as.numeric(AvgBCG$YLat)
AvgBCG$XLong  <- as.numeric(AvgBCG$XLong)
AvgBCG.SP  <- SpatialPointsDataFrame(AvgBCG[,c(8,7)],
                                        AvgBCG[,-c(8,7)])
proj4string(AvgBCG.SP) <- CRS("+proj=utm +zone=18 +datum=WGS84") 
str(AvgBCG.SP) # Now is class SpatialPointsDataFrame
#Write as geojson
writeOGR(AvgBCG.SP,"BCGsites",layer="AvgBCG", driver='GeoJSON')


#####BUG ONLY#####################################
##################################################
BugBCG<-BCG[BCG$SAMPLE=='BUG',]

AvgBugBCG<- BugBCG %>%
          group_by(STA_SEQ) %>%
            summarise(AvgBCG=mean(METRIC_VALUE),CntBCG=n())%>%
              as.data.frame()

AvgBugBCG<- merge(AvgBugBCG,sites,by.x="STA_SEQ")

#Make sure coordinates are numeric.  Create a SpatialPointsDataFrame
AvgBugBCG$YLat  <- as.numeric(AvgBugBCG$YLat)
AvgBugBCG$XLong  <- as.numeric(AvgBugBCG$XLong)
AvgBugBCG.SP  <- SpatialPointsDataFrame(AvgBugBCG[,c(7,6)],
                                        AvgBugBCG[,-c(7,6)])
proj4string(AvgBugBCG.SP) <- CRS("+proj=utm +zone=18 +datum=WGS84") 
str(AvgBugBCG.SP) # Now is class SpatialPointsDataFrame
#Write as geojson
writeOGR(AvgBugBCG.SP,"BugBCGsites",layer="AvgBugBCG", driver='GeoJSON')


#####FISH ONLY#####################################
##################################################
FishBCG<-BCG[BCG$SAMPLE=='FISH',]

AvgFishBCG<- FishBCG %>%
  group_by(STA_SEQ) %>%
  summarise(AvgBCG=mean(METRIC_VALUE),CntBCG=n())%>%
  as.data.frame()

AvgFishBCG<- merge(AvgFishBCG,sites,by.x="STA_SEQ")

#Make sure coordinates are numeric.  Create a SpatialPointsDataFrame
AvgFishBCG$YLat  <- as.numeric(AvgFishBCG$YLat)
AvgFishBCG$XLong  <- as.numeric(AvgFishBCG$XLong)
AvgFishBCG.SP  <- SpatialPointsDataFrame(AvgFishBCG[,c(7,6)],
                                        AvgFishBCG[,-c(7,6)])
proj4string(AvgFishBCG.SP) <- CRS("+proj=utm +zone=18 +datum=WGS84") 
str(AvgFishBCG.SP) # Now is class SpatialPointsDataFrame
#Write as geojson
writeOGR(AvgFishBCG.SP,"FishBCGsites",layer="AvgFishBCG", driver='GeoJSON')
