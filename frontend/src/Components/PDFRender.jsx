import React , {Component} from 'react';
import styled from '@react-pdf/styled-components';
import { Page, Text, View, Document, StyleSheet, Font} from '@react-pdf/renderer';
import Montserrat from '../Fonts/Montserrat-Regular.ttf'
import * as utilities from '../Utilities'
import Bus from '../assets/bus.png'
import Logo from '../assets/logo.PNG'

// Register font
Font.register({ 
  family: 'Montserrat', 
  src: Montserrat });

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: 'white',
    fontFamily: 'Montserrat',
    marginLeft: '30px',
  }
});


const HeadingBlock = styled.View`
  margin-top: 20px;
  height: 100px;
  
  flex-direction: row;
  justify-content: flex-start;
`


const TrippyLogo = styled.Image`
  height: 100px;
  object-fit: contain;
`

const HeadingTextBox = styled.View`
  flex-direction: column;
  width: 400px;
  margin-top: 40px;
`

const HeadingText = styled.Text`
  font-size: 15px;
  
  text-align: left;
`

const DetailsText = styled.Text`
  font-size: 10px;
  
  text-align: left;
`

// TIMELINE STARTS ----------------------------------

const TimelineBox = styled.View`
  margin-top: 30px;
  flex-direction: row;
`

const ActivitiesBox = styled.View`
  width: 67vw;
`
const AdditionalInfoBox = styled.View`
  width: 33vw;
`

const TodoText = styled.Text`
  font-size: 20px;
  font-weight: bold;
`

const TodoListBox = styled.View`
  border: 1px solid black;
  width: 25vw;
  height: 300px;
  margin-right: 10px;
`

const TodoCategoryText = styled.Text`
  text-align: center;
  font-size: 15px;
  margin-bottom: 5px;
  margin-top: 5px;
`

const TodoItem = styled.Text`
  text-align: center
  font-size: 10px;
`

const ImageFillerBox = styled.View`
  margin-top: 10px;
  height: 200px;
  flex-direction: column;
`

const ImageFillerImage = styled.Image`
  width: 25vw;
  background-color: white;
  min-height: 0;
  max-height: 10vh;
  object-fit: cover;
  margin-bottom: 3px;
`

// DAY BOX STARTS ----------------------------------
const DayBox = styled.View`
  background-color: white;
  display: flex;
  align-items: flex-start;
`

// DAY STARTING BOX ----------------------------------
const DayTimeBox = styled.View`
  background-color: black;
  width: 80px
  color: white;
  font-size: 10px;
  font-weight: bold;
  border-radius: 5vw;
  padding: 5px;
  text-align: center;

  margin-bottom: 10px;
`

// RESULT ACTIVITY CSS
const ResultActivity = styled.View`  
  border-left: solid blue;
  flex-direction: row;
  width: 45vw;
  margin-bottom: 10px;
`

// DIRECTIONS BOX --------------------------------
const DirectionBox = styled.View`
  flex-direction: row;
`
const DirectionImageText = styled.View`
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 10px;
  margin-left: 70px;
  flex-direction: row;
  background-color: peachpuff;
`
const BusImage = styled.Image`
  height: 20px;
  width: 20px;
`

const DirectionText = styled.Text`
  font-size: 10px;
  padding-top: 5px;
  padding-left: 10px;
`
// RESULT ACTIVITY BOX: TIME -------------------------------

const ResultTimeBox = styled.View`
  height: 120%;
  width: 80px;
  text-align: center;
  justify-content: space-between;
`

const ResultTimeStart = styled.Text`
  font-size: 10px;
`
const ResultTimeEnd = styled.Text`
  font-size: 10px;
`

// RESULT ACTIVITY BOX: DESCRIPTION -------------------------------
const ResultTextBox = styled.View`
  margin-top: 10px;
  flex-direction: column
`
const ResultName = styled.Text`
  font-size: 12px;
  max-width: 50vw;
`

const ResultAddress = styled.Text`
  margin-top: 5px;
  font-size: 8px;
  max-width: 50vw;
`
// RESULT ACTIVITY BOX: MISC -------------------------------
const VerticalLine = styled.View`

  height: 20px;
  width: 0;
  border: 0.5px solid grey;
  background-color: black
  margin-left: 35px;
`

const InsideVerticalLine = 
  styled.View`
    height: 20px;
    width: 0;
    border: 0.5px solid blue;
    background-color: black
    margin-left: 35px;
    margin-top: 0;
  `

class PDFRender extends Component {
  state = {
    trip: JSON.parse(localStorage.trip),
  }
  // <PDFViewer width="1400px" height="700px">
  render() {
    return( 
    <Document>
      {this.props.trip.itinerary.map((dayValue, dayIndex) => {
        return(
      <Page size="A4" wrap style={styles.page}>
        <HeadingBlock>
          <TrippyLogo src={Logo}/>
          <HeadingTextBox>
            <HeadingText> Your trip to {this.props.trip.country} </HeadingText>
            <DetailsText> From {utilities.getFormattedDate(this.props.trip.startDate.toString())} to {utilities.getFormattedDate(this.props.trip.endDate.toString())} </DetailsText>
          </HeadingTextBox>
        </HeadingBlock>


        <TimelineBox>
          <ActivitiesBox>
            <DayBox>

                <DayTimeBox> 
                  <Text> Day {dayIndex} </Text> 
                </DayTimeBox>
                {
                  dayValue.map((value, index) => {
                    if (index !== 0 && index !== (dayValue.length - 1)){
                    return (
                      <View>
                        <ResultActivity>
                          <ResultTimeBox>
                            <ResultTimeStart> {utilities.formatDate(value.startTime)} </ResultTimeStart> 
                            <InsideVerticalLine/>
                            <ResultTimeEnd> {utilities.formatDate(value.endTime)} </ResultTimeEnd> 
                          </ResultTimeBox>

                          
                          
                          <ResultTextBox>
                            <ResultName> {value.name} </ResultName>                            
                            <ResultAddress> {value.formatted_address} </ResultAddress>
                          </ResultTextBox>

                        </ResultActivity>

                        { (index !== dayValue.length - 2) && 
                          <View>
                            <VerticalLine/>
                            <DirectionBox>
                              <InsideVerticalLine/>
                              <DirectionImageText>
                                <BusImage src={Bus}/>
                                <DirectionText> {this.props.trip.itiDirections[dayIndex][index-1] && this.props.trip.itiDirections[dayIndex][index-1].routes[0].legs[0].duration.text} </DirectionText>
                              </DirectionImageText>
                            </DirectionBox>
                            <VerticalLine/>
                              
                          </View>
                        }

                      </View>)
                    } else {
                      return null;
                    }
                  })
                }

            </DayBox>
          </ActivitiesBox>
          <AdditionalInfoBox>
            <TodoText> Todo </TodoText>
            <TodoListBox> 
              <TodoCategoryText> Tickets </TodoCategoryText>
              <TodoItem> Coming Soon </TodoItem>
              <TodoItem> Coming Soon </TodoItem>
              <TodoItem> Coming Soon </TodoItem>
            </TodoListBox>

            <ImageFillerBox>
              {
                dayValue.map( (value, index) => {
                  if (index !== 0 && index !== (dayValue.length-1)){
                    if (value.displayPhoto) {
                      return <ImageFillerImage src={value.displayPhoto}/>
                    } else {
                      return null;
                    }
                  } else {
                    return null;
                  }
                })
              }
            </ImageFillerBox>
          </AdditionalInfoBox>
        </TimelineBox>
      </Page>)
      })}
    </Document>
    )
  }

}

export default PDFRender;