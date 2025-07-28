import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { QuranReader } from './QuranReader';
import { Volume2, VolumeX, ArrowLeft, Moon, Sun, RotateCcw } from 'lucide-react';

interface RoomProps {
  roomId: string;
  onBack: () => void;
}

interface RoomConfig {
  name: string;
  description: string;
  ambientSound: string;
  backgroundClass: string;
  quranPosition: { x: string; y: string };
}

const roomConfigs: Record<string, RoomConfig> = {
  'rainy-study': {
    name: 'Rainy Study',
    description: 'Rain gently pattering against the window',
    ambientSound: 'rain',
    backgroundClass: 'bg-gradient-to-br from-muted via-secondary to-primary',
    quranPosition: { x: 'left-1/2', y: 'top-3/4' }
  },
  'sunny-garden': {
    name: 'Garden View',
    description: 'Birds chirping in the sunny garden',
    ambientSound: 'birds',
    backgroundClass: 'bg-gradient-to-br from-warm-glow via-accent to-secondary',
    quranPosition: { x: 'right-1/4', y: 'top-2/3' }
  },
  'fireplace-nook': {
    name: 'Fireplace Nook',
    description: 'Crackling fire warming the cozy space',
    ambientSound: 'fire',
    backgroundClass: 'bg-gradient-to-br from-firelight via-primary to-secondary',
    quranPosition: { x: 'left-1/3', y: 'top-1/2' }
  },
  'moonlit-corner': {
    name: 'Moonlit Corner',
    description: 'Peaceful moonlight through the window',
    ambientSound: 'night',
    backgroundClass: 'bg-gradient-to-br from-moonlight via-secondary to-muted',
    quranPosition: { x: 'right-1/3', y: 'top-3/5' }
  },
  'seaside-sanctuary': {
    name: 'Seaside Sanctuary',
    description: 'Ocean waves and distant seagulls',
    ambientSound: 'waves',
    backgroundClass: 'bg-gradient-to-br from-ocean-blue via-secondary to-muted',
    quranPosition: { x: 'left-1/4', y: 'top-1/2' }
  },
  'desert-mirage': {
    name: 'Desert Mirage',
    description: 'Gentle desert winds and sandy whispers',
    ambientSound: 'desert',
    backgroundClass: 'bg-gradient-to-br from-sandy-gold via-accent to-primary',
    quranPosition: { x: 'right-1/2', y: 'top-2/3' }
  },
  'tuscan-vista': {
    name: 'Tuscan Vista',
    description: 'Italian breeze and distant city murmurs',
    ambientSound: 'city',
    backgroundClass: 'bg-gradient-to-br from-tuscan-terracotta via-secondary to-warm-glow',
    quranPosition: { x: 'left-1/3', y: 'top-3/5' }
  },
  'stellar-meditation': {
    name: 'Stellar Meditation',
    description: 'Cosmic silence and ethereal space ambiance',
    ambientSound: 'space',
    backgroundClass: 'bg-gradient-to-br from-cosmic-purple via-primary to-muted',
    quranPosition: { x: 'right-1/4', y: 'top-1/2' }
  },
  'alpine-retreat': {
    name: 'Alpine Retreat',
    description: 'Mountain winds through peaceful peaks',
    ambientSound: 'wind',
    backgroundClass: 'bg-gradient-to-br from-alpine-white via-secondary to-primary',
    quranPosition: { x: 'left-1/2', y: 'top-3/4' }
  },
  'woodland-haven': {
    name: 'Woodland Haven',
    description: 'Forest sounds and rustling leaves',
    ambientSound: 'forest',
    backgroundClass: 'bg-gradient-to-br from-forest-green via-secondary to-primary',
    quranPosition: { x: 'right-1/3', y: 'top-1/3' }
  }
};

export const Room = ({ roomId, onBack }: RoomProps) => {
  console.log('🏠 Room component starting with ID:', roomId);
  
  const roomConfig = roomConfigs[roomId];
  
  if (!roomConfig) {
    console.log('❌ No room config found');
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'red' }}>
        <p style={{ color: 'white', fontSize: '24px' }}>Room not found: {roomId}</p>
      </div>
    );
  }

  console.log('✅ Room config found, rendering room');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#8B4513', 
      color: 'white',
      padding: '40px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
        🏠 {roomConfig.name}
      </h1>
      
      <p style={{ fontSize: '24px', marginBottom: '40px' }}>
        {roomConfig.description}
      </p>
      
      <button 
        onClick={onBack}
        style={{
          padding: '12px 24px',
          fontSize: '18px',
          backgroundColor: '#654321',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        ← Back to Rooms
      </button>
      
      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '8px'
      }}>
        <p>✅ Room is working! ID: {roomId}</p>
        <p>✅ Room name: {roomConfig.name}</p>
        <p>✅ No crashes detected</p>
      </div>
    </div>
  );
};