import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import PainHistoryItem from '@/components/PainHistoryItem';
import { PainProvider, usePainContext } from '@/context/PainContext';
import { getPainEntries } from '@/utils/storage';
import { PainEntry } from '@/types';
import { Download, Upload } from 'lucide-react-native';

function HistoryContent() {
  const { painEntries, setPainEntries, removePainEntry } = usePainContext();

  // Refresh data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const loadEntries = async () => {
        const entries = await getPainEntries();
        if (entries) {
          setPainEntries(entries);
        }
      };

      loadEntries();
    }, [setPainEntries])
  );

  const exportToCSV = () => {
    if (painEntries.length === 0) {
      alert('No entries to export');
      return;
    }

    const headers = 'Body Part,Pain Level,Date\n';
    const csvContent = painEntries
      .map(entry => {
        const date = new Date(entry.timestamp).toLocaleString();
        return `${entry.bodyPart},${entry.painLevel},"${date}"`;
      })
      .join('\n');

    const fullContent = headers + csvContent;

    if (Platform.OS === 'web') {
      const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'pain_history.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For mobile platforms, we'd implement sharing functionality
      // This is just a placeholder since we're focusing on web
      alert('Export functionality is currently only available on web');
    }
  };

  const importFromCSV = () => {
    if (Platform.OS !== 'web') {
      alert('Import functionality is currently only available on web');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        const lines = text.split('\n');
        
        // Skip header row
        const newEntries: PainEntry[] = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const [bodyPart, painLevel, dateStr] = line.split(',').map(item => 
            item.replace(/^"(.*)"$/, '$1').trim()
          );
          
          if (bodyPart && !isNaN(Number(painLevel))) {
            newEntries.push({
              id: crypto.randomUUID(),
              bodyPart,
              painLevel: Number(painLevel),
              timestamp: new Date(dateStr).getTime(),
            });
          }
        }

        if (newEntries.length > 0) {
          setPainEntries(prev => [...prev, ...newEntries]);
          alert(`Successfully imported ${newEntries.length} entries`);
        } else {
          alert('No valid entries found in the CSV file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

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
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={exportToCSV}
        >
          <Download size={20} color="#4A6FA5" />
          <Text style={styles.actionButtonText}>Export</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={importFromCSV}
        >
          <Upload size={20} color="#4A6FA5" />
          <Text style={styles.actionButtonText}>Import</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  actionButtonText: {
    marginLeft: 8,
    color: '#4A6FA5',
    fontWeight: '500',
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