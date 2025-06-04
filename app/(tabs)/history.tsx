import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import PainHistoryItem from '@/components/PainHistoryItem';
import { PainProvider, usePainContext } from '@/context/PainContext';
import { getPainEntries } from '@/utils/storage';
import { PainEntry } from '@/types';

function HistoryContent() {
  const { painEntries, setPainEntries, removePainEntry } = usePainContext();

  useEffect(() => {
    const loadEntries = async () => {
      const entries = await getPainEntries();
      if (entries) {
        setPainEntries(entries);
      }
    };

    loadEntries();
  }, [setPainEntries]);

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No pain entries recorded yet.</Text>
      <Text style={styles.emptySubtext}>
        Use the "Log Pain" tab to record your first entry.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={painEntries.sort((a, b) => b.timestamp - a.timestamp)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PainHistoryItem 
            entry={item} 
            onDelete={() => removePainEntry(item.id)} 
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmptyList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

export default function HistoryScreen() {
  return (
    <PainProvider>
      <HistoryContent />
    </PainProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  list: {
    padding: 16,
    flexGrow: 1,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A6FA5',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#95A5A6',
    textAlign: 'center',
  },
});