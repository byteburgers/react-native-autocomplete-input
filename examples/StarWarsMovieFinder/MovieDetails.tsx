import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Movie } from './swapi';

interface Props {
  movie: Movie;
}

export function MovieDetails({ movie }: Props): React.ReactElement {
  const { title, director, openingCrawl, episode } = movie;
  return (
    <View>
      <Text style={styles.titleText}>
        {episode}. {title}
      </Text>
      <Text style={styles.directorText}>({director})</Text>
      <Text style={styles.openingText}>{openingCrawl}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center',
  },
  directorText: {
    color: 'grey',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  openingText: {
    textAlign: 'center',
  },
});
