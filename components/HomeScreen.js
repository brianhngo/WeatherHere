import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  Pressable,
  Image,
  ImageBackground,
  ScrollView,
  FlatList,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import axios from 'axios';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const currentTime = new Date()
    .toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      hour12: false,
    })
    .slice(11, 16);

  const [searchBarText, setSearchBarText] = useState('');
  const [data, setData] = useState({});
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const keyWeatherApi = '998b6d759af44124ab8211011232807';

  const handleSearchPress = async () => {
    try {
      const axiosData = await axios.get(
        'http://api.weatherapi.com/v1/forecast.json',
        { params: { key: keyWeatherApi, q: searchBarText, days: 7 } }
      );

      setData(axiosData.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMapPress = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      const axiosData = await axios.get(
        'http://api.weatherapi.com/v1/forecast.json',
        {
          params: {
            key: keyWeatherApi,
            q: `${location.coords.latitude},${location.coords.longitude}`,
            days: 7,
          },
        }
      );

      setData(axiosData.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.body}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../assets/images/background.jpg')}>
        <ScrollView>
          <SafeAreaView style={styles.container}>
            {/* Search Bar */}

            <View style={styles.searchBarContainer}>
              <TextInput
                style={styles.TextInput}
                value={searchBarText}
                onChangeText={setSearchBarText}
                placeholder="Please Enter City"
                placeholderTextColor="white"
              />
              <Pressable onPress={handleSearchPress}>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  style={styles.svg}>
                  <Path
                    fillRule="evenodd"
                    d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                    clipRule="evenodd"
                  />
                </Svg>
              </Pressable>
              <Pressable onPress={handleMapPress}>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                  style={styles.svg}>
                  <Path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <Path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </Svg>
              </Pressable>
            </View>
            {/* Forecast Section  */}

            {Object.keys(data).length === 0 ? null : (
              <View style={styles.ForeCast}>
                <Text style={styles.LocationText3}>
                  {data?.location?.name}, {data?.location?.region}
                </Text>
                <Text style={styles.LocationText3}>
                  {data?.location?.country}
                </Text>
                <Text style={styles.LocationText2}>
                  {data.current.temp_f} °F{' '}
                </Text>
                <Text style={styles.LocationText2}>
                  Low - {data?.forecast?.forecastday[0]?.day?.mintemp_f}°F
                </Text>
                <Text style={styles.LocationText2}>
                  High - {data?.forecast?.forecastday[0]?.day?.maxtemp_f}
                  °F
                </Text>
                <Image
                  style={styles.image}
                  source={{ uri: `https:${data?.current?.condition?.icon}` }}
                />
                <Text style={styles.LocationText3}>
                  {' '}
                  {data?.current?.condition?.text}{' '}
                </Text>
                {/* Hour by Hour Breakdown */}

                {data?.forecast?.forecastday[0]?.hour && (
                  <FlatList
                    horizontal
                    data={data.forecast.forecastday[0].hour.filter(
                      (element) => {
                        if (currentTime < element.time.slice(11, 16)) {
                          return element;
                        }
                      }
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <View style={styles.futureForecastday2}>
                        <Image
                          style={styles.image4}
                          source={{ uri: `https:${item.condition.icon}` }}
                        />
                        <Text style={styles.TextFour}> {item.temp_f}°F</Text>
                        <Text style={styles.TextFour}>{item.time}</Text>
                      </View>
                    )}
                  />
                )}

                {/* Daily Weather Description */}
                <View style={styles.ForeCastDetails}>
                  <View style={styles.ForeCastDetailElement}>
                    <Image
                      style={styles.image2}
                      source={require('../assets/images/wind.png')}
                    />
                    <View>
                      <Text style={styles.LocationText}> Wind </Text>
                      <Text style={styles.LocationText}>
                        {' '}
                        {data?.current?.wind_mph} mph{' '}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.ForeCastDetailElement}>
                    <Image
                      style={styles.image2}
                      source={require('../assets/images/drop.png')}
                    />
                    <View>
                      <Text style={styles.LocationText}> Rain </Text>
                      <Text style={styles.LocationText}>
                        {' '}
                        {data?.current?.precip_in}%{' '}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.ForeCastDetailElement}>
                    <Image
                      style={styles.image2}
                      source={require('../assets/images/sun.png')}
                    />
                    <View>
                      <Text style={styles.LocationText}> Visibility </Text>
                      <Text style={styles.LocationText}>
                        {' '}
                        {data?.current?.vis_miles} mi
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.ForeCastDetails}>
                  <View style={styles.ForeCastDetailElement}>
                    <Image
                      style={styles.image2}
                      source={require('../assets/images/humidty.png')}
                    />
                    <View>
                      <Text style={styles.LocationText}> Humidty </Text>
                      <Text style={styles.LocationText}>
                        {' '}
                        {data?.current?.humidity}%{' '}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.ForeCastDetailElement}>
                    <Image
                      style={styles.image2}
                      source={require('../assets/images/cloud.png')}
                    />
                    <View style={styles.ForeCastDetailElementContainer}>
                      <Text style={styles.LocationText}> Cloud </Text>
                      <Text style={styles.LocationText}>
                        {' '}
                        {data?.current?.cloud}%
                      </Text>
                    </View>
                  </View>
                  <View style={styles.ForeCastDetailElement}>
                    <Image
                      style={styles.image2}
                      source={require('../assets/images/sun.png')}
                    />
                    <View>
                      <Text style={styles.LocationText}> UV </Text>
                      <Text style={styles.LocationText}>
                        {' '}
                        {data?.current?.uv}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
            {/* 7 day ForeCast */}
            <ScrollView horizontal>
              <View style={styles.futureForecast}>
                {Object.keys(data).length === 0
                  ? null
                  : data?.forecast?.forecastday.map((element) => (
                      <View style={styles.futureForecastday} key={element.date}>
                        <Image
                          style={styles.image3}
                          source={{
                            uri: `https:${element?.day?.condition?.icon}`,
                          }}
                        />
                        <View style={styles.FutureForeCastText}>
                          <Text style={styles.TextInput}> {element?.date}</Text>
                          <Text style={styles.TextInput}>
                            {' '}
                            {element?.day?.maxtemp_f} °F
                          </Text>
                          <Text style={styles.TextInput2}>
                            {' '}
                            {element.day.condition.text}
                          </Text>
                        </View>
                      </View>
                    ))}
              </View>
            </ScrollView>
          </SafeAreaView>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    position: 'relative',
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
    flex: 1,
    color: 'white',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,

    width: '100%',
    alignItems: 'center',
  },
  container1: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 60,
    width: '40%',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
  },
  svg: {
    width: 24,
    height: 24,
  },
  image: {
    width: 200,
    height: 200,
  },
  TextInput: {
    flex: 1,
    color: 'white',
  },
  ForeCast: {
    flex: 1,
    alignItems: 'center',
    gap: 20,

    width: '100%',
  },
  LocationText: {
    color: 'white',
    fontSize: 12,
  },
  LocationText2: {
    color: 'white',
    fontSize: 24,
  },
  LocationText3: {
    color: 'white',
    fontSize: 18,
  },
  ForeCastDetails: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
  },
  TextFour: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  futureForecastday2: {
    flex: 1,
    width: 100,
    height: 100,
    marginLeft: 20,
    borderWidth: 0.5,
    borderRadius: 20,

    justifyContent: 'center',
    alignContent: 'center',
    borderColor: '#dddddd',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  ForeCastDetailElement: {
    textAlign: 'center',
    justifyContent: ' center',
    flexDirection: 'row',
    gap: 10,
    width: '20%',
  },
  ForeCastDetailElementContainer: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  image2: {
    width: 24,
    height: 24,
  },
  futureForecast: {
    paddingTop: 15,
    flexDirection: 'row',
    paddingHorizontal: 10,
    width: '100%',
  },
  futureForecastday: {
    flex: 1,
    width: 160,
    height: 150,
    marginLeft: 20,
    borderWidth: 0.5,
    borderRadius: 20,

    justifyContent: 'center',
    alignContent: 'center',
    borderColor: '#dddddd',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  image3: {
    width: 64,
    height: 64,
    left: '25%',
  },
  FutureForeCastText: {
    left: '10%',
    flex: 1,

    paddingTop: 10,
  },
  TextInput2: {
    flexWrap: 'wrap',
    color: 'white',
    flex: 1,
    width: '90%',
  },
  image4: {
    width: 40,
    height: 40,
    left: '25%',
  },
});
