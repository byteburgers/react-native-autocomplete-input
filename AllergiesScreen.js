//AllergiesScreen

import React, { Component, useState, useEffect } from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    BackHandler,
    ScrollView,
    FlatList,
} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';

import { button, AppFonts, TrialHeader } from '../../Resources/index';
import { getLayoutSize, getFontSize } from '../../Component/Responsive';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default class AllergiesScreen extends Component {

    constructor(props){
        super(props);
        this.state={
            query: '',
            films: [
                {
                    name: 'Surat',
                    image:require("../../Assets/ImageAndIcons/add.png"),
                },
                {
                    name: 'Baroda',
                    image: require("../../Assets/ImageAndIcons/add.png"),
                },
                {
                    name: 'Mumbai',
                    image: require("../../Assets/ImageAndIcons/add.png"),
                },
                {
                    name: 'Delhi',
                    image: require("../../Assets/ImageAndIcons/add.png"),
                },
                {
                    name: 'Rajot',
                    image: require("../../Assets/ImageAndIcons/add.png"),
                },
            ],
            message:[
            ],
            array:[],
        };
    }

    disableBackButton = () => {
        this.props.navigation.navigate("NutritionScreen");
        return true;
    }

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.disableBackButton);
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.disableBackButton);
    }

    findFilm(query) {
        if (query === '') {
            return [];
        }

        const { films } = this.state;
        const regex = new RegExp(`${query.trim()}`, 'i');
        return films.filter(film => film.name.search(regex) >= 0);
    }

    joinData = (itemname) => {
        this.state.message.push({ name: itemname})
        //this.setState({ message: [...this.state.films] })
    }

    removeText(item) {
        this.setState({
            message: this.state.message.filter((_item) => _item.name !== item.name)
        });

    }

    renderItem({ item}) {
        return (
            <View>
                <View style={{flex: 1,justifyContent:"space-between",flexDirection:"row",marginTop:getLayoutSize(10) }}>
                    <Text style={{ fontWeight: 'bold', color: "white",fontSize:getFontSize(15) }}>
                        {item.name}
                    </Text>
                    <TouchableOpacity onPress={() => { this.setState({ query: item.name, }),this.joinData(item.name)}}> 
                        <Image source={item.image} style={styles.addImage}></Image>
                    </TouchableOpacity>
                 </View>
            </View>
        );
    }

    renderItem2({ item}) {
        return (
            <View style={{ justifyContent: "space-between", flexDirection: "row", flex: 1, alignItems: "center", marginTop: getLayoutSize(15)  }}>
                <Text style={{ fontWeight: 'bold', color: "white" ,alignSelf:"center",fontSize:getFontSize(15)}}>
                    {item.name}
                </Text>
                <TouchableOpacity onPress={() => {this.removeText(item)}}>
                    <Image source={require("../../Assets/ImageAndIcons/remove.png")} style={styles.removeImage}></Image>
                </TouchableOpacity>
            </View>
        );
    }


    render() {
        const { query } = this.state;
        const films = this.findFilm(query);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

        return (
            <View style={styles.mainContainer}>
                <TrialHeader imgSrc={require("../../Assets/ImageAndIcons/back_with_arrow.png")} value={7} screen={"NutritionScreen"} navigation={this.props.navigation}></TrialHeader>
                <View style={styles.container}>
                    <ScrollView style={{flexGrow:1}}>
                    <Text style={styles.header}>DO YOU HAVE ANY</Text>
                    <Text style={styles.header2}>ALLERGIES?</Text>
                    <Text style={styles.headerContent}>lorem ipsum dolor sit amet,consectetur</Text>
                    <Text style={styles.headerContent2}>adipisicing elit,sed to eiusmod tempor.</Text>
                    <View style={{marginTop:getLayoutSize(40)}}>
                        <Autocomplete
                                autoCapitalize="none"
                                autoCorrect={false}
                                backgroundColor={"#000000"}
                                color={"#ffffff"}
                                containerStyle={styles.autocompleteContainer}
                                data={films.length === 1 && comp(query, films[0].name) ? [] : films}
                                defaultValue={query}
                                onChangeText={text => this.setState({ query: text })}
                                placeholder="Search..."
                                placeholderTextColor={"#868686"}
                                renderItem={this.renderItem.bind(this)}
                                listStyle={styles.mainContainer}
                        />
                    </View>
                        <FlatList
                            style={{ marginTop: 40, flex: 1 }}
                            data={this.state.message}
                            keyExtractor={(item) => item}
                            renderItem={this.renderItem2.bind(this)}
                        />
                    </ScrollView>
                    <View style={styles.registerButtonView}>
                        <TouchableOpacity style={button.ButtonLoginContainer} onPress={() => { this.props.navigation.navigate("PlanScreen") }}>
                            <Text style={button.mainScreenButtonLoginText}>NEXT STEP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: "black",
        flex: 1,
    },
    container: {
        flex: 1,
        padding: getLayoutSize(25),
    },
    header: {
        fontFamily: AppFonts.text.font2,
        fontSize: getFontSize(28),
        color: "white",
        alignSelf: "center",
        marginTop: getLayoutSize(20),
    },
    header2: {
        fontFamily: AppFonts.text.font2,
        fontSize: getFontSize(28),
        color: "white",
        alignSelf: "center",
    },
    headerContent: {
        color: "#868686",
        alignSelf: "center",
        marginTop: getLayoutSize(20),
        fontSize: getFontSize(13),
        fontFamily: AppFonts.text.font3,
    },
    headerContent2: {
        color: "#868686",
        alignSelf: "center",
        fontSize: getFontSize(13),
        fontFamily: AppFonts.text.font3,
    },
    autocompleteContainer: {
        flex: 1,
        left: 0,
        right: 0,
        top: 0,
        zIndex: 1,
    },
    addImage:{
        height:getLayoutSize(20),
        width:getLayoutSize(20),
        tintColor:"#ffffff"
    },
    removeImage: {
        height: getLayoutSize(20),
        width: getLayoutSize(20),
        tintColor: "#ffffff",
        alignSelf:"center"
    },
    registerButtonView: {
        marginTop: getLayoutSize(0),
    },
})