# AI Chatbot Implementation

## Overview

The AI chatbot is powered by Google's Gemini AI and provides intelligent assistance for supply chain management queries.

## Features

✅ **Real-time Data Integration** - Fetches live data from your API
✅ **Gemini AI Powered** - Uses Google's advanced language model
✅ **Context-Aware** - Understands your orders, shipments, and inventory
✅ **User-Specific** - Only accesses your own data
✅ **Fallback Handling** - Graceful error handling if AI service is unavailable
✅ **Suggestion Buttons** - Quick access to common queries

## How It Works

1. **Data Fetching**: On load, fetches your orders, shipments, and inventory from the API
2. **User Query**: You ask a question
3. **Context Building**: Combines your question with your data
4. **AI Processing**: Sends to Gemini AI for intelligent response
5. **Response Display**: Shows AI-generated answer

## Setup

### 1. Get Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

### 2. Add to Environment

Add to `.env` file:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

### 3. Restart Development Server

```bash
npm run dev
```

## Usage Examples

### Track Shipments
```
User: "Show me all delayed shipments"
AI: "Based on your data, you have 2 delayed shipments: 
     SHP-001 (Origin: Mumbai, Destination: Delhi)
     SHP-003 (Origin: Bangalore, Destination: Chennai)"
```

### Check Inventory
```
User: "What items are low in stock?"
AI: "You have 3 items with low stock:
     - Electronics (SKU: EC-001): 45 units
     - Smartphones (SKU: SB-002): 30 units
     - Tablets (SKU: TB-003): 20 units"
```

### Order Status
```
User: "How many pending orders do I have?"
AI: "You currently have 5 pending orders totaling $12,450. 
     The oldest pending order is ORD-1001 from 3 days ago."
```

### General Questions
```
User: "What does this app do?"
AI: "This is a supply chain management system that helps you:
     - Track shipments and deliveries
     - Manage inventory across warehouses
     - Process and monitor orders
     - Coordinate with suppliers and distributors"
```

## Technical Details

### Component Location
```
src/components/AIChatBot.tsx
```

### Dependencies
```json
{
  "@google/generative-ai": "^0.24.1"
}
```

### API Integration

The chatbot fetches data from:
- `/api/orders` - User's orders
- `/api/shipments` - User's shipments
- `/api/inventory` - User's inventory

### Data Privacy

- Only fetches YOUR data (filtered by userId)
- Data is sent to Gemini AI for processing
- No data is stored by the chatbot
- Follows Google's AI usage policies

## Customization

### Change AI Model

Edit `AIChatBot.tsx`:

```typescript
const model = genAI.getGenerativeModel({ 
  model: "gemini-pro"  // Change to "gemini-pro-vision" for image support
});
```

### Adjust Response Length

Edit the context prompt:

```typescript
const context = `...
Keep responses under 150 words.`; // Change word limit
```

### Add More Suggestions

Edit the suggestions array:

```typescript
const suggestions = [
  "Show low stock items",
  "What are my pending orders?",
  "Track my shipments",
  "Show inventory summary",
  "Your custom suggestion here", // Add more
];
```

### Modify Styling

The chatbot uses Tailwind CSS classes. Edit the JSX in `AIChatBot.tsx`.

## Error Handling

### No API Key
```
Error: "Gemini API key not configured"
Solution: Add VITE_GEMINI_API_KEY to .env
```

### API Rate Limit
```
Error: "Rate limit exceeded"
Solution: Wait a few minutes or upgrade API plan
```

### Network Error
```
Error: "Failed to fetch app data"
Solution: Check backend is running and API_URL is correct
```

### Invalid Response
```
Error: "AI service unavailable"
Solution: Check internet connection and API key validity
```

## Performance

- **Initial Load**: ~500ms (fetches data)
- **Query Response**: ~2-3 seconds (AI processing)
- **Data Refresh**: On component mount only
- **Memory Usage**: ~5MB (includes AI SDK)

## Limitations

- Requires internet connection
- Gemini API has rate limits (free tier: 60 requests/minute)
- Context limited to first 10 items of each data type
- Responses limited to ~150 words for conciseness

## Future Enhancements

- [ ] Voice input support
- [ ] Multi-language support
- [ ] Chat history persistence
- [ ] Export chat conversations
- [ ] Image analysis for shipment photos
- [ ] Predictive analytics
- [ ] Automated alerts and suggestions

## Troubleshooting

### Chatbot Not Appearing

1. Check if `<AIChatBot />` is in `App.tsx`
2. Verify component import is correct
3. Check browser console for errors

### No Responses

1. Verify API key is set
2. Check browser console for errors
3. Test API key at https://makersuite.google.com
4. Check network tab for failed requests

### Wrong Data Shown

1. Verify user is logged in
2. Check localStorage has valid token
3. Verify backend is filtering by userId
4. Check API responses in network tab

## Support

- Gemini AI Docs: https://ai.google.dev/docs
- API Reference: https://ai.google.dev/api
- Issue Tracker: Create issue in GitHub repo

## Credits

- **AI Model**: Google Gemini Pro
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS
