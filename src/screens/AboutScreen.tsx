import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

interface Ability {
    app: string,
    link: string,
}

interface Developer {
    name: string,
    links: Ability[],
    skills: string[],
}

const developers: Developer[] = [
    {
        name: 'Gustavo Ordoño',
        links: [
            {
                app: 'Github',
                link: '.com',
            },
            {
                app: 'Codeforces',
                link: '.com',
            },
            {
                app: 'Email',
                link: '.com',
            },
        ],
        skills: [''],
    },
    {
        name: 'Diego Huamaní',
        links: [
            {
                app: 'Github',
                link: '.com',
            },
            {
                app: 'Codeforces',
                link: '.com',
            },
            {
                app: 'Email',
                link: '.com',
            },
        ],
        skills: [''],
    },
    {
        name: 'Diego Pacori',
        links: [
            {
                app: 'Github',
                link: '.com',
            },
            {
                app: 'Codeforces',
                link: '.com',
            },
            {
                app: 'Email',
                link: '.com',
            },
        ],
        skills: [''],
    },
];

export const AboutScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Contribuidores
            </Text>
            <Text style={styles.description}>
                Somos alumnos de la Universidad Nacional de San Agustín apasionados por el desarrollo de software y la programación competitiva.
            </Text>
            <FlatList
                data={developers}
                numColumns={2}
                renderItem={({item}) => (
                    <View style={styles.devContainer}>
                        <View>
                            <Text>{item.name}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container :{
        flex: 1,
        backgroundColor: '#f9b5a5',
    },
    title: {
        fontSize: 25,
        fontWeight: '600',
        textAlign: 'center',
        color: '#000',
        marginVertical: 20,
    },
    description: {
        paddingHorizontal: 15,
        fontSize: 16,
        fontWeight: '400',
        color: '#202020',
        lineHeight: 23,
    },
});
