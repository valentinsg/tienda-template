'use client';

import React, { useState } from 'react';
import { Input, VStack, Box, Text } from '@chakra-ui/react';
import axiosInstance from '../../utils/axiosInstance';

const AddressAutocomplete = ({ onSelect }: { onSelect: (address: string) => void }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  
    if (value.length > 2) {
      try {
        const response = await axiosInstance.get(
          `search?format=json&q=${value}`
        );
  
        const results = (response.data as { display_name: string }[]).map((item) => item.display_name);
        setSuggestions(results);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <VStack align="stretch">
      <Input
        placeholder="1234 Main Street"
        value={query}
        onChange={handleInputChange}
      />
      {suggestions.length > 0 && (
        <Box borderWidth="1px" borderRadius="md" mt={2} bg="white" p={2}>
          {suggestions.map((suggestion, index) => (
            <Box
              key={index}
              p={2}
              _hover={{ bg: 'gray.100', cursor: 'pointer' }}
              onClick={() => {
                setQuery(suggestion);
                setSuggestions([]);
                onSelect(suggestion);
              }}
            >
              <Text>{suggestion}</Text>
            </Box>
          ))}
        </Box>
      )}
    </VStack>
  );
};

export default AddressAutocomplete;
