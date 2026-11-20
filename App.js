import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MOODS = ['Happy', 'Sad', 'Hopeful', 'Grateful', 'Motivated', 'Calm', 'Anxious'];

const QUOTES = [
  { id: '1', mood: 'Happy', text: 'Joy grows when shared.', author: 'Obioma', story: 'Mara had forgotten to celebrate small wins until a friend asked her what she enjoyed today. Their laughter reminded her that joy can be deliberately noticed.' },
  { id: '2', mood: 'Sad', text: 'You are allowed to pause without giving up.', author: 'Obioma', story: 'After a difficult week, Elena sat beside a quiet window instead of forcing herself forward. Rest gave her strength to continue with honesty.' },
  { id: '3', mood: 'Hopeful', text: 'The next step can be a beginning.', author: 'Obioma', story: 'A seed does not see the garden ahead, yet it opens to the light one small moment at a time.' },
  { id: '4', mood: 'Grateful', text: 'Notice what is already carrying you.', author: 'Obioma', story: 'Daniel made a list of ordinary gifts: breath, friendship, food, and a second chance. Gratitude changed the scale of his whole day.' },
  { id: '5', mood: 'Motivated', text: 'Small progress still moves you forward.', author: 'Obioma', story: 'Aisha completed only one task, but it broke the weight of the mountain. One task became a habit, and one habit became change.' },
  { id: '6', mood: 'Calm', text: 'Peace begins when you stop rushing the moment.', author: 'Obioma', story: 'On a crowded morning, Samuel took three slow breaths before replying. The moment remained busy, but he no longer belonged to the rush.' },
  { id: '7', mood: 'Anxious', text: 'One moment is enough for one breath.', author: 'Obioma', story: 'Tolu stopped arguing with the future and named five things around him. Reality became small enough to hold while her courage returned.' },
  { id: '8', mood: 'Happy', text: 'Make room for what makes you feel alive.', author: 'Obioma', story: 'Nneka spent ten minutes doing the hobby she had postponed for years. It did not solve everything, but it gave joy somewhere to live.' },
  { id: '9', mood: 'Hopeful', text: 'Tomorrow is still listening for your first step.', author: 'Obioma', story: 'A worried traveler began packing only what she needed for the next mile. The long road became kinder when she stopped carrying the whole journey.' },
  { id: '10', mood: 'Motivated', text: 'Begin before confidence arrives.', author: 'Obioma', story: 'The musician did not wait to feel ready. She played the uncertain first note, and confidence slowly joined the practice.' },
];

export default function App() {
  const [mood, setMood] = useState('Happy');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [selected, setSelected] = useState(null);
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('obioma-favorites').then(value => value && setFavorites(JSON.parse(value)));
  }, []);

  const filtered = useMemo(() => QUOTES.filter(q =>
    q.mood === mood && (`${q.text} ${q.author}`).toLowerCase().includes(search.toLower()}()), [mood, search]);

  const toggleFavorite = async quote => {
    const next = favorites.includes(quote.id) ? favorites.filter(id => id !== quote.id) : [...favorites, quote.id];
    setFavorites(next);
    await AsyncStorage.setItem('obioma-favorites', JSON.stringify(next));
  };

  const ask = () => {
    const value = question.trim();
    if (!value) return;
    setAnswers(prev => [{ id: Date.now(), text: value }, ...prev]);
    setQuestion('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff1f5" />
      <View style={styles.header}>
        <Text style={styles.brand}>OBIOMA</Text>
        <Text style={styles.title}>Pink Edition</Text>
      </View>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search quotes"
        placeholderTextColor="#b76b83"
        style={styles.search}
      />

      <View style={styles.moods}>
        {MOODS.map(item => (
          <TouchableOpacity
            key={item}
            onPress={() => setMood(item)}
            style={[styles.mood, mood === item && styles.moodActive]}>
            <Text style={[styles.moodText, mood === item && styles.moodTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 30 }}
        ListEmptyComponent={<Text style={styles.empty}>No quotes in this mood yet.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => setSelected(item)} activeOpacity={0.88}>
            <Text style={styles.quote}>“{item.text}”</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.author}>— {item.author}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(item)}>
                <Text style={styles.heart}>{favorites.includes(item.id) ? '♥' : '♡'}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={!!selected} animationType="slide" onRequestClose={() => setSelected(null)}>
        {selected && (
          <SafeAreaView style={styles.detail}>
            <TouchableOpacity style={styles.close} onPress={() => setSelected(null)}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.detailMood}>{selected.mood}</Text>
            <Text style={styles.detailQuote}>“{selected.text}”</Text>
            <Text style={styles.storyTitle}>The story</Text>
            <Text style={styles.story}>{selected.story}</Text>
            <View style={styles.qa}>
              <Text style={styles.storyTitle}>Questions & answers</Text>
              <View style={styles.askRow}>
                <TextInput
                  value={question}
                  onChangeText={setQuestion}
                  placeholder="Ask a question…"
                  placeholderTextColor="#b76b83"
                  style={styles.askInput}
                />
                <TouchableOpacity onPress={ask} style={styles.askButton}>
                  <Text style={styles.askButtonText}>Ask</Text>
                </TouchableOpacity>
              </View>
              {answers.map(answer => (
                <Text key={answer.id} style={styles.answer}>{answer.text}</Text>
              ))}
            </View>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff1f5' },
  header: { alignItems: 'center', paddingTop: 12, paddingBottom: 8 },
  brand: { color: '#b83267', fontSize: 15, fontWeight: '800', letterSpacing: 4 },
  title: { color: '#4a1d31', fontSize: 24, fontWeight: '800', marginTop: 3 },
  search: { marginHorizontal: 18, marginBottom: 10, backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 16, height: 48, color: '#4a1d31' },
  moods: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingBottom: 10, justifyContent: 'center' },
  mood: { margin: 4, borderRadius: 18, borderWidth: 1, borderColor: '#f3aec2', paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#fffafd' },
  moodActive: { backgroundColor: '#d94f85', borderColor: '#d94f85' },
  moodText: { color: '#923958', fontWeight: '700', fontSize: 13 },
  moodTextActive: { color: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 22, marginTop: 10, borderWidth: 1, borderColor: '#f7ccd8' },
  quote: { color: '#3c1a29', fontSize: 21, lineHeight: 31, fontWeight: '600', textAlign: 'center' },
  cardFooter: { marginTop: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  author: { color: '#a34a6b', fontWeight: '700' },
  heart: { color: '#d94f85', fontSize: 30, lineHeight: 32 },
  empty: { color: '#a34a6b', textAlign: 'center', marginTop: 40 },
  detail: { flex: 1, backgroundColor: '#fff1f5', padding: 24 },
  close: { alignSelf: 'flex-end', width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  closeText: { color: '#b83267', fontSize: 30, lineHeight: 34 },
  detailMood: { color: '#d94f85', textAlign: 'center', fontWeight: '800', marginTop: 10, letterSpacing: 2 },
  detailQuote: { color: '#3c1a29', fontSize: 27, lineHeight: 39, fontWeight: '800', textAlign: 'center', marginVertical: 24 },
  storyTitle: { color: '#8f3155', fontSize: 18, fontWeight: '800', marginBottom: 8 },
  story: { color: '#5e4050', fontSize: 16, lineHeight: 25 },
  qa: { marginTop: 28 },
  askRow: { flexDirection: 'row' },
  askInput: { flex: 1, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, height: 48, color: '#4a1d31' },
  askButton: { marginLeft: 8, backgroundColor: '#d94f85', borderRadius: 12, height: 48, paddingHorizontal: 16, justifyContent: 'center' },
  askButtonText: { color: '#fff', fontWeight: '800' },
  answer: { marginTop: 10, backgroundColor: '#fff', borderRadius: 12, padding: 12, color: '#5e4050' },
});
