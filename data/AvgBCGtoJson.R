setwd('~/Projects/ProgramDev/BCGMap')
library(dplyr)
library(rgdal)


BCG<-read.csv("data/BCG_Bioassessments_2022_050522.csv",header=TRUE)
sites<-read.csv("data/sitesDB_050522.csv",header=TRUE)


AvgBCG<- BCG %>%
  group_by(STA_SEQ,SAMPLE) %>%
  summarise(AvgBCG=mean(METRIC_VALUE),CntBCG=n())%>%
  as.data.frame()

AvgBCG<- merge(AvgBCG,sites,by.x="STA_SEQ")

s_sites <- unique(AvgBCG[c(1,5:7)])
BugBCG <- AvgBCG[which(AvgBCG$SAMPLE=='BUG'), ]
colnames(BugBCG)[3] <- 'BugBCG'
FishBCG <- AvgBCG[which(AvgBCG$SAMPLE=='FISH'), ]
colnames(FishBCG)[3] <- 'FishBCG'

AvgBCG <- merge(s_sites, BugBCG[,c(1,3)], by="STA_SEQ", all.x=TRUE)
AvgBCG <- merge(AvgBCG, FishBCG[,c(1,3)], by="STA_SEQ", all.x=TRUE)
AvgBCG[is.na(AvgBCG)] <- 0



#Make sure coordinates are numeric.  Create a SpatialPointsDataFrame
AvgBCG$YLat  <- as.numeric(AvgBCG$YLat)
AvgBCG$XLong  <- as.numeric(AvgBCG$XLong)
AvgBCG.SP  <- SpatialPointsDataFrame(AvgBCG[,c(4,3)],
                                        AvgBCG[,-c(4,3)])
proj4string(AvgBCG.SP) <- CRS("+proj=utm +zone=18 +datum=WGS84") 
str(AvgBCG.SP) # Now is class SpatialPointsDataFrame
#Write as geojson
writeOGR(AvgBCG.SP,"FBBCGsites",layer="AvgBCG", driver='GeoJSON')


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


#####BUG/FISH Per Site#####################################
##################################################
BugBCG<-BCG[BCG$SAMPLE=='BUG',]

AvgBugBCG<- BugBCG %>%
  group_by(STA_SEQ) %>%
  summarise(AvgBCG=mean(METRIC_VALUE))%>%
  as.data.frame()

colnames(AvgBugBCG)[2]<-"BugBCG"

FishBCG<-BCG[BCG$SAMPLE=='FISH',]

AvgFishBCG<- FishBCG %>%
  group_by(STA_SEQ) %>%
  summarise(AvgBCG=mean(METRIC_VALUE))%>%
  as.data.frame()

colnames(AvgFishBCG)[2]<-"FishBCG"

FishBugBCG<-merge(AvgBugBCG,AvgFishBCG,by="STA_SEQ",all=TRUE)
FishBugBCG<-merge(FishBugBCG,sites,by="STA_SEQ")