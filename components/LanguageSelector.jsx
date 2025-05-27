import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'tl', label: 'Tagalog' },
  { code: 'ceb', label: 'Cebuano' }
];

const LanguageSelector = ({ onClose }) => {
  const { language, changeLanguage, t } = useLanguage();

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>{t('language')}</Text>
        {LANGUAGES.map(l => (
          <TouchableOpacity
            key={l.code}
            style={[
              styles.langButton,
              language === l.code && styles.selected
            ]}
            onPress={() => {
              changeLanguage(l.code);
              if (onClose) onClose();
            }}
          >
            <Text style={styles.langText}>{l.label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    minWidth: 270,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#333'
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 180,
    backgroundColor: '#F8D64E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 6,
    justifyContent: 'center',
    boxShadow: "0px 4px 4px rgba(0,0,0,0.3)"
  },
  selected: {
    borderWidth: 2,
    borderColor: '#333'
  },
  langText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  closeButton: {
    marginTop: 18,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#F8D64E'
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default LanguageSelector;
