{/* Document for occurring api calls */}

import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from "axios";
import {useEffect} from "react";
import {router} from "expo-router";

export interface Team {
    id: number;
    name: string;
    logo: string | null;
    description: string;
    club: string | null;
    players: TeamPlayer[];
}

export interface TeamPlayer {
    id: number;
    number: number|null;
    team: number;
    player: number;
    shirt: number|null;
}

{/* function to get all teams connected to token */}

export const getTeamsfromApi = async () => {
    const tokenString = await AsyncStorage.getItem('userToken');
    if (!tokenString) {
        console.error('No token found');
        alert('No token found');
        router.push('/loginPage');
        return;
    }
    try {
        const response = await Axios({
            url: '/api/clubber/teams/',
            method: 'get',
            baseURL: 'https://api.bnh.dust.ludd.ltu.se/',
            headers: {
                'content-type': 'application/json',
                Authorization: `Token ${tokenString}`, // Add token to the Authorization header
            },
        });
        return response.data.results as Team[];
    } catch (error) {
        console.log("Error in getTeamsfromApi");
        console.log(error);
    }
}

export const getTeamFromId = async (homeTeamId: number, awayTeamId: number) => {
    const tokenString = await AsyncStorage.getItem('userToken');
    if (!tokenString) {
        console.error('No token found');
        alert('No token found');
        router.push('/loginPage');
        return;
    }
    console.log("Here is the token used in getTEamFromId", tokenString);
    try {
        const response = await Axios({
            url: '/api/clubber/teams/',
            method: 'get',
            baseURL: 'https://api.bnh.dust.ludd.ltu.se/',
            params: {
                id: homeTeamId,
            },
            headers: {
                'content-type': 'application/json',
                Authorization: `Token ${tokenString}`, // Add token to the Authorization header
            },
        });
        return response.data as Team[];
    } catch (error) {
        console.log("Error in getTeamFromId", error);
        console.log(error);
    }
}
