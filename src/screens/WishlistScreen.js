import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  Alert,
  TextInput,
  Pressable,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { addItem, deleteItem, getWishlist, refreshItem, searchItems } from '../services/api';
import ItemCard from '../components/ItemCard';
import SoftButton from '../components/SoftButton';
import { pastelTheme, softShadow } from '../theme/pastel';

export default function WishlistScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [refreshingItemId, setRefreshingItemId] = useState(null);
  const [addingResultKey, setAddingResultKey] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [input, setInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [activeSection, setActiveSection] = useState('wishlist');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const wishlistItems = await getWishlist();
    setItems(wishlistItems);
    setLoading(false);
  };

  const handleSearch = async () => {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      Alert.alert('Missing Input', 'Please enter a product query or paste a product URL.');
      return;
    }

    try {
      setSubmitting(true);
      const results = await searchItems(trimmedInput);
      setSearchResults(results);
      setSearched(true);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to search for items');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddSearchResult = async (result) => {
    try {
      setAddingResultKey(result.itemId);
      const newItem = await addItem(result);
      setItems((currentItems) => [
        newItem,
        ...currentItems.filter((currentItem) => currentItem.itemId !== newItem.itemId),
      ]);
      setInput('');
      setSearchResults([]);
      setSearched(false);
      setActiveSection('wishlist');
      Alert.alert('Success', 'Item added to your wishlist.');
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to add item');
    } finally {
      setAddingResultKey(null);
    }
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Remove Item',
      `Remove "${item.name}" from your wishlist?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingItemId(item.itemId);
              await deleteItem(item.itemId);
              setItems((currentItems) =>
                currentItems.filter((currentItem) => currentItem.itemId !== item.itemId),
              );
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to remove item');
            } finally {
              setDeletingItemId(null);
            }
          },
        },
      ],
    );
  };

  const handleRefresh = async (item) => {
    try {
      setRefreshingItemId(item.itemId);
      const refreshedItem = await refreshItem(item);
      setItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.itemId === item.itemId ? refreshedItem : currentItem,
        ),
      );
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to refresh item');
    } finally {
      setRefreshingItemId(null);
    }
  };

  const openProductDetails = (item) => {
    navigation.navigate('Product Details', { item });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={[styles.heroCard, softShadow]}>
          <View style={styles.heroBubbleLarge} />
          <View style={styles.heroBubbleSmall} />
          <Text style={styles.heroEyebrow}>Shopping assistant</Text>
          <Text style={styles.title}>Keep your cutest deals in one place.</Text>
          <Text style={styles.heroText}>
            Search for a product, save the sweetest match, and compare retailers without leaving
            your cozy wishlist corner.
          </Text>
          <View style={styles.heroMetaRow}>
            <View style={[styles.heroPill, styles.heroPillWarm]}>
              <Text style={styles.heroPillText}>
                {items.length} {items.length === 1 ? 'item' : 'items'} saved
              </Text>
            </View>
            <View style={[styles.heroPill, styles.heroPillMint]}>
              <Text style={styles.heroPillText}>
                {activeSection === 'add' ? 'Search mode' : 'Wishlist mode'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionBar}>
          <Pressable
            style={[
              styles.sectionButton,
              activeSection === 'add' ? styles.sectionButtonActive : null,
            ]}
            onPress={() => setActiveSection('add')}
          >
            <Text
              style={[
                styles.sectionButtonText,
                activeSection === 'add' ? styles.sectionButtonTextActive : null,
              ]}
            >
              Search & save
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.sectionButton,
              activeSection === 'wishlist' ? styles.sectionButtonActive : null,
            ]}
            onPress={() => {
              setActiveSection('wishlist');
              loadItems();
            }}
          >
            <Text
              style={[
                styles.sectionButtonText,
                activeSection === 'wishlist' ? styles.sectionButtonTextActive : null,
              ]}
            >
              My wishlist
            </Text>
          </Pressable>
        </View>

        {activeSection === 'add' ? (
          <View style={[styles.panel, softShadow]}>
            <Text style={styles.panelEyebrow}>Fresh finds</Text>
            <Text style={styles.panelTitle}>Add a product to your pastel shelf</Text>
            <Text style={styles.panelDescription}>
              Paste a product URL or type a product query like "ipad pro" to find grouped matches.
            </Text>
            <TextInput
              placeholder='Paste a URL or type a query like "ipad pro"'
              placeholderTextColor={pastelTheme.muted}
              value={input}
              onChangeText={setInput}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
            <SoftButton
              title={submitting ? 'Searching...' : 'Search for matches'}
              onPress={handleSearch}
              disabled={submitting}
              tone="primary"
              fullWidth
            />
            {searched && searchResults.length > 0 ? (
              <Text style={styles.resultSummary}>
                {searchResults.length} {searchResults.length === 1 ? 'match' : 'matches'} ready to
                save
              </Text>
            ) : null}
            {searched && searchResults.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No matching products found.</Text>
                <Text style={styles.emptyText}>
                  Try a shorter query, a more exact model name, or a retailer product link.
                </Text>
              </View>
            ) : null}
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) => `${item.itemId}-${index}`}
              renderItem={({ item }) => (
                <ItemCard
                  item={item}
                  adding={addingResultKey === item.itemId}
                  onPress={() => openProductDetails(item)}
                  onAdd={() => handleAddSearchResult(item)}
                />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          <View style={[styles.panel, softShadow]}>
            <View style={styles.panelHeaderRow}>
              <View>
                <Text style={styles.panelEyebrow}>Saved picks</Text>
                <Text style={styles.panelTitle}>Your wishlist nook</Text>
              </View>
              <SoftButton
                title="Refresh list"
                onPress={loadItems}
                disabled={loading}
                tone="lavender"
                compact
              />
            </View>
            <Text style={styles.panelDescription}>
              Tap any card to compare retailer offers, or refresh a product when you want a new
              price check.
            </Text>
            {loading ? (
              <ActivityIndicator color={pastelTheme.accentDeep} style={styles.statusSpacing} />
            ) : null}
            {!loading && items.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No wishlist items yet.</Text>
                <Text style={styles.emptyText}>
                  Search for something you love and save the first item to start your collection.
                </Text>
              </View>
            ) : null}
            <FlatList
              data={items}
              keyExtractor={(item) => item.itemId}
              renderItem={({ item }) => (
                <ItemCard
                  item={item}
                  refreshing={refreshingItemId === item.itemId}
                  deleting={deletingItemId === item.itemId}
                  onPress={() => openProductDetails(item)}
                  onRefresh={() => handleRefresh(item)}
                  onDelete={() => handleDelete(item)}
                />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: pastelTheme.background,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: pastelTheme.background,
  },
  heroCard: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: pastelTheme.border,
    padding: 20,
    marginBottom: 16,
    backgroundColor: pastelTheme.surface,
  },
  heroBubbleLarge: {
    position: 'absolute',
    top: -18,
    right: -8,
    width: 128,
    height: 128,
    borderRadius: 999,
    backgroundColor: pastelTheme.accentSoft,
  },
  heroBubbleSmall: {
    position: 'absolute',
    bottom: -12,
    left: -12,
    width: 76,
    height: 76,
    borderRadius: 999,
    backgroundColor: '#fff1bf',
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: pastelTheme.accentDeep,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: pastelTheme.heading,
    marginBottom: 8,
  },
  heroText: {
    fontSize: 15,
    lineHeight: 22,
    color: pastelTheme.text,
    marginBottom: 14,
  },
  heroMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  heroPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  heroPillWarm: {
    backgroundColor: pastelTheme.sunshine,
    borderColor: '#ead07e',
  },
  heroPillMint: {
    backgroundColor: pastelTheme.mint,
    borderColor: '#a8dbc8',
  },
  heroPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: pastelTheme.heading,
  },
  sectionBar: {
    flexDirection: 'row',
    backgroundColor: '#fff3ee',
    borderRadius: 999,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: pastelTheme.border,
  },
  sectionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
  sectionButtonActive: {
    backgroundColor: pastelTheme.accent,
  },
  sectionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: pastelTheme.text,
  },
  sectionButtonTextActive: {
    color: pastelTheme.white,
  },
  panel: {
    flex: 1,
    backgroundColor: pastelTheme.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: pastelTheme.border,
    padding: 18,
  },
  panelHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  panelEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: pastelTheme.lavenderDeep,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  panelTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: pastelTheme.heading,
    marginBottom: 6,
  },
  panelDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: pastelTheme.text,
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: pastelTheme.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    backgroundColor: '#fffaf8',
    color: pastelTheme.heading,
    fontSize: 15,
  },
  statusSpacing: {
    marginTop: 16,
    marginBottom: 10,
  },
  resultSummary: {
    marginTop: 12,
    marginBottom: 4,
    fontSize: 13,
    fontWeight: '700',
    color: pastelTheme.accentDeep,
  },
  emptyCard: {
    borderWidth: 1,
    borderColor: pastelTheme.border,
    borderRadius: 22,
    backgroundColor: pastelTheme.surfaceAlt,
    padding: 16,
    marginTop: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: pastelTheme.heading,
    marginBottom: 4,
  },
  emptyText: {
    color: pastelTheme.text,
    lineHeight: 20,
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 24,
  },
});
