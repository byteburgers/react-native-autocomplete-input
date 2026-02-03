import Autocomplete from 'react-native-autocomplete-input';
import React, { useEffect, useState } from 'react';
import { SWAPI, type Movies, filterMovies } from './swapi';
import { MovieDetails } from './MovieDetails';
import { Platform, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { Search } from './Search';

function StarWarsMovieFinder(): React.ReactElement {
  const [allMovies, setAllMovies] = useState<Movies>([]);
  const [query, setQuery] = useState('');
  const queriedMovies = React.useMemo(() => filterMovies(allMovies, query), [allMovies, query]);

  const [firstMovieSuggestion] = queriedMovies;
  const suggestions = React.useMemo(
    () =>
      firstMovieSuggestion?.compareTitle(query)
        ? [] // Close suggestion list in case movie title matches query
        : queriedMovies,
    [queriedMovies, query, firstMovieSuggestion],
  );

  useEffect(() => {
    (async function fetchMovies() {
      setAllMovies(await SWAPI.getAllMovies());
    })();
  }, []);

  const isLoading = !allMovies.length;
  const placeholder = isLoading ? 'Loading data...' : 'Enter Star Wars film title';
  const handleClear = () => setQuery('');

  return (
    <SafeAreaView style={styles.saveView}>
      <View style={styles.container}>
        <View style={styles.autocompleteContainer}>
          <Autocomplete
            editable={!isLoading}
            autoCorrect={false}
            data={suggestions}
            renderTextInput={(props) => <Search {...props} onClear={handleClear} />}
            value={query}
            onChangeText={setQuery}
            placeholder={placeholder}
            flatListProps={{
              keyboardShouldPersistTaps: 'always',
              keyExtractor: (movie) => movie.episodeId.toString(),
              renderItem: ({ item }) => (
                <TouchableOpacity onPress={() => setQuery(item.title)}>
                  <Text style={styles.itemText}>{item.title}</Text>
                </TouchableOpacity>
              ),
            }}
          />
        </View>

        <View style={styles.descriptionContainer}>
          {firstMovieSuggestion ? (
            <MovieDetails movie={firstMovieSuggestion} />
          ) : (
            <Text style={styles.infoText}>Enter Title of a Star Wars movie</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  saveView: {
    flex: 1,
  },
  container: {
    position: 'relative',
    backgroundColor: '#F5FCFF',
    flex: 1,

    // Android requiers padding to avoid overlapping
    // with content and autocomplete
    paddingTop: 50,

    // Make space for the default top bar
    ...Platform.select({
      android: {
        marginTop: 25,
      },
      default: {
        marginTop: 0,
      },
    }),
  },
  itemText: {
    fontSize: 15,
    margin: 2,
  },
  descriptionContainer: {
    // `backgroundColor` needs to be set otherwise the
    // autocomplete input will disappear on text input.
    backgroundColor: '#F5FCFF',
    marginTop: 8,
  },
  infoText: {
    textAlign: 'center',
  },
  autocompleteContainer: {
    // Hack required to make the autocomplete
    // work on Andrdoid
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
    padding: 5,
  },
});

export default StarWarsMovieFinder;
