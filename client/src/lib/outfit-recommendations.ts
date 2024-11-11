interface OutfitRule {
  temp: [number, number];
  conditions: string[];
  outfit: {
    top: string;
    bottom: string;
    accessories: string[];
    description: string;
  };
}

const outfitRules: OutfitRule[] = [
  {
    temp: [30, 100],
    conditions: ['Clear', 'Clouds'],
    outfit: {
      top: 'Light cotton t-shirt',
      bottom: 'Shorts or lightweight pants',
      accessories: ['Sunglasses', 'Hat', 'Sunscreen'],
      description: 'Light and breathable clothing for hot weather'
    }
  },
  {
    temp: [20, 29],
    conditions: ['Clear', 'Clouds'],
    outfit: {
      top: 'Short sleeve shirt',
      bottom: 'Light pants or knee-length skirt',
      accessories: ['Light jacket', 'Sunglasses'],
      description: 'Comfortable clothing for warm weather'
    }
  },
  {
    temp: [10, 19],
    conditions: ['Clear', 'Clouds'],
    outfit: {
      top: 'Long sleeve shirt',
      bottom: 'Jeans or long pants',
      accessories: ['Light sweater'],
      description: 'Layered clothing for mild weather'
    }
  },
  {
    temp: [-10, 9],
    conditions: ['Clear', 'Clouds'],
    outfit: {
      top: 'Sweater',
      bottom: 'Warm pants',
      accessories: ['Winter coat', 'Scarf', 'Gloves'],
      description: 'Warm clothing for cold weather'
    }
  },
  {
    temp: [-100, -11],
    conditions: ['Clear', 'Clouds'],
    outfit: {
      top: 'Thermal shirt',
      bottom: 'Insulated pants',
      accessories: ['Heavy winter coat', 'Warm hat', 'Gloves', 'Scarf'],
      description: 'Heavy winter clothing for extreme cold'
    }
  },
  {
    temp: [-100, 100],
    conditions: ['Rain'],
    outfit: {
      top: 'Waterproof jacket',
      bottom: 'Water-resistant pants',
      accessories: ['Umbrella', 'Waterproof shoes'],
      description: 'Rain protection gear'
    }
  },
  {
    temp: [-100, 100],
    conditions: ['Snow'],
    outfit: {
      top: 'Insulated winter coat',
      bottom: 'Snow pants',
      accessories: ['Winter boots', 'Warm hat', 'Gloves', 'Scarf'],
      description: 'Snow protection gear'
    }
  }
];

export function getOutfitRecommendation(temp: number, condition: string) {
  const rule = outfitRules.find(
    r => temp >= r.temp[0] && temp <= r.temp[1] && r.conditions.includes(condition)
  ) || outfitRules[2]; // default to mild weather outfit
  
  return rule.outfit;
}
