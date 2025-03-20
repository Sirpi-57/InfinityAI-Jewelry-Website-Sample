// Helper function to generate SKU
const generateSKU = (category, index) => {
    const categoryMap = {
        'tikka': 'TIK',
        'neckpieces': 'NEC',
        'earrings': 'EAR',
        'bangles': 'BAN',
        'bracelets': 'BRA',
        'haarams': 'HAA',
        'american-diamond': 'AMD',
        'rings': 'RNG'
    };
    return `${categoryMap[category]}-${String(index).padStart(4, '0')}`;
};

// Categories data
const categories = [
    {
        id: 'tikka',
        name: 'Tikka',
        image: 'tikka.webp',
        description: 'Traditional forehead jewelry pieces'
    },
    {
        id: 'neckpieces',
        name: 'Neckpieces',
        image: 'neckpiece2.webp',
        description: 'Elegant necklaces for every occasion'
    },
    {
        id: 'earrings',
        name: 'Earrings',
        image: 'earring2.webp',
        description: 'Beautiful earrings collection'
    },
    {
        id: 'bangles',
        name: 'Bangles',
        image: 'bangle3.webp',
        description: 'Traditional and modern bangles'
    },
    {
        id: 'bracelets',
        name: 'Bracelets',
        image: 'bracelet1.webp',
        description: 'Stylish bracelets for all occasions'
    },
    {
        id: 'haarams',
        name: 'Haarams',
        image: 'haaram2.webp',
        description: 'Traditional long necklaces'
    },
    {
        id: 'american-diamond',
        name: 'American Diamond',
        image: 'ad3.webp',
        description: 'Premium American diamond jewelry'
    },
    {
        id: 'rings',
        name: 'Rings',
        image: 'ring2.webp',
        description: 'Stunning ring collection'
    }
];

// Descriptions for each category
const descriptions = {
    'tikka': [
        'Elegant traditional lakshmi tikka with kundan work',
        'Contemporary tikka design with intricate meenakari details',
        'Classic bridal tikka',
        'Modern tikka with delicate chain work and crystals',
        'Antique finish tikka with traditional motifs'
    ],
    'neckpieces': [
        'American Diamond Neckpiece with intricate stone work',
        'Contemporary layered necklace with gold finish',
        'Traditional temple jewelry necklace',
        'Daily wear necklace with ruby details',
        'Daily wear neckpiece with rose gold finish'
    ],
    'earrings': [
        'Chandelier earrings with pearl drops',
        'Traditional jhumkas with parrrot design',
        'Contemporary drops with pearl work',
        'Antique finish studs with ruby details',
        'Modern drops with crystal accents'
    ],
    'bangles': [
        'Traditional kada with antique finish',
        'Emerald studded bangles set',
        'Traditional temple pattern bangles',
        'American diamond designer bangles',
        'Contemporary slim bangles set'
    ],
    'bracelets': [
        'Stone bracelet with antique gold finish',
        'Butterfly charm bracelet with precious stones',
        'Modern chain bracelet with crystal work',
        'Daily wear simple bracelet',
        'Ruby strand bracelet with gold accents'
    ],
    'haarams': [
        'Antique finish haaram with ruby details',
        'Ruby layered haaram with emerald drops',
        'Traditional long haaram with temple design',
        'Contemporary haaram with meenakari work',
        'Bridal Lakshmi haaram with kundan work'
    ],
    'american-diamond': [
        'Classic haaram with AD stones',
        'Contemporary chocker set with AD work',
        'Designer haaram and earrings set with premium AD stones',
        'Modern chocker and drops with AD details',
        'Luxury blackstone worked neckpiece with solitaire AD'
    ],
    'rings': [
        'Solitaire engagement ring with lakshmi design',
        'Traditional temple design ring with antique works',
        'Modern statement ring with emerald and pearl work',
        'Antique finish lakshmi ring with detailed work',
        'Contemporary designer ring with precious stones'
    ]
};

// Category-specific images for each item
const categoryImages = {
    'tikka': [
        'tikka1.webp',
        'tikka2.webp',
        'tikka3.webp',
        'tikka4.webp',
        'tikka5.webp'
    ],
    'neckpieces': [
        'neckpiece1.webp',
        'neckpiece2.webp',
        'neckpiece3.webp',
        'necklace4.png',
        'necklace5.png'
    ],
    'earrings': [
        'earring1.webp',
        'earring2.webp',
        'earring3.webp',
        'earring4.webp',
        'earring5.webp'
    ],
    'bangles': [
        'bangle1.webp',
        'bangle2.webp',
        'bangle3.webp',
        'bangle4.webp',
        'bangle5.webp'
    ],
    'bracelets': [
        'bracelet1.webp',
        'bracelet2.webp',
        'bracelet3.png',
        'bracelet4.png',
        'bracelet5.png'
    ],
    'haarams': [
        'haaram1.webp',
        'haaram2.webp',
        'haaram3.webp',
        'haaram4.webp',
        'haaram5.webp'
    ],
    'american-diamond': [
        'ad1.webp',
        'ad2.webp',
        'ad3.webp',
        'ad4.webp',
        'ad5.webp'
    ],
    'rings': [
        'ring1.webp',
        'ring2.webp',
        'ring3.webp',
        'ring4.webp',
        'ring5.webp'
    ]
};

// Generate jewelry items for each category
const generateJewelryItems = () => {
    const items = [];
    categories.forEach(category => {
        for (let i = 0; i < 5; i++) {
            items.push({
                id: `${category.id}-${i + 1}`,
                sku: generateSKU(category.id, i + 1),
                name: `${category.name} ${descriptions[category.id][i].split(' with')[0]}`,
                description: descriptions[category.id][i],
                price: Math.floor(Math.random() * (50000 - 5000) + 5000),
                image: categoryImages[category.id][i],
                category: category.id
            });
        }
    });
    return items;
};

const jewelry = generateJewelryItems();