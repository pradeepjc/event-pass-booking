# Event Pass Booking — React Native (Expo)

## Run it

```bash
npm install
npx expo start        # press w (web), i (iOS simulator), a (Android), or scan the QR code with Expo Go
```

To see the grid adapt, rotate the device, or resize the browser window in web mode.

## User flow

1. **Catalog**: a grid of 6 events across music, AI and NFL. The badge at the top shows the orientation, the width and the current column count.
2. **Detail form**: opens with the tapped event's `itemId`, `title` and `basePrice`. Fill in name, email, quantity, ticket type and parking.
3. **Confirmation**: shows the submitted order. "Back to catalog" returns to the grid.

## Rubric coverage

| Criterion | How this project meets it |
|-----------|---------------------------|
| **Adaptive Grid & UI** | The grid reflows live from 2 columns (portrait phone) to 3–4 (landscape or tablet) using `useWindowDimensions()`. Cards and images resize with the screen, and a badge shows the current orientation, width and column count. |
| **Navigation & Dynamic Routes** | A native-stack flow goes Catalog → DetailForm → Confirmation. `itemId`, `title` and `basePrice` are passed as route params, and the header title comes from the selected event. The full order payload is passed on to Confirmation, and "Back to catalog" returns to the start. |
| **Form & Validation Logic** | All inputs are controlled: text, email, numeric quantity, a custom ticket-type selector and a switch. Validation runs as you type (required name, email format, quantity from 1 to 10) with inline red errors. Submit stays disabled and greyed out until the form is valid. |
| **Collaboration & Execution** | The full flow works end to end on Android (Expo Go) and web. Roles: A built the grid and adaptive UI, B the navigation and params, and C the form and validation (see Team roles). |
| **Evidence Submission** | A 60-second demo video (link at the top) and this README, which maps each topic to its source file and lines. |

## Where the 6 core topics are implemented

- **1. Items in a Grid**: `screens/CatalogScreen.js:38-45`
  - A `FlatList` renders the event cards with a dynamic `numColumns={cols}`.
  - `key={cols}` remounts the list when the column count changes, because `numColumns` can't change on a mounted list.
- **2. Adaptive UI**: `screens/CatalogScreen.js:6-10`
  - `useWindowDimensions()` reads the live width and height.
  - Columns: 2 below 600px (phone portrait), 3 from 600–899px, 4 at 900px and above (landscape or tablet).
  - Card and image sizes are computed from the width, and a badge shows the orientation, width and column count.
- **3. Screen Navigation**: `App.js:8-22`
  - `createNativeStackNavigator()` from `@react-navigation/native-stack` with 3 screens: `CatalogScreen`, `DetailFormScreen` and `ConfirmationScreen`.
- **4. Dynamic Navigation**: `screens/CatalogScreen.js:17`, `screens/DetailFormScreen.js:19`, `App.js:19`
  - Tapping a card calls `navigation.navigate('DetailForm', { itemId, title, basePrice })`.
  - The form reads them from `route.params`, and the header title is set from `route.params.title`.
  - On submit, the full order is passed to `Confirmation` (`DetailFormScreen.js:39`); "Back to catalog" calls `popToTop()` (`ConfirmationScreen.js:15`).
- **5. User Inputs & Form Management**: `screens/DetailFormScreen.js:21-27, 49-93`
  - All fields are controlled with `useState`: name and email (`TextInput`), quantity (numeric `TextInput`), ticket type (custom chip selector: General, VIP, Backstage) and parking (`Switch`).
  - A live total is computed as `basePrice × quantity`.
- **6. Form Validation**: `screens/DetailFormScreen.js:5-15, 29-35, 97-98`
  - `validate()` runs on every render: name is required, email must match a regex, and quantity must be a whole number from 1 to 10.
  - Inline red error text and a red border appear once a field has been touched.
  - The submit button is `disabled={!isValid}`, greyed out and labelled "Complete the form to book" until the form is valid.

## Project structure

```
App.js                        Navigation stack
data.js                       Mock event data: 6 events (music, AI, NFL)
screens/CatalogScreen.js      Adaptive grid
screens/DetailFormScreen.js   Controlled form and validation
screens/ConfirmationScreen.js Order summary
```

## AI usage


### 1. Prompting for data
**Done by AI:**
- Generated the mock event array in `data.js` (`id`, `title`, `venue`, `date`, `basePrice`, `image`).
- Narrowed it to three categories (music, AI, NFL) with two events each, ordered so related events share a row.
- Found openly licensed images on Wikimedia Commons, saved them in `assets/events/` and wrote the credits table.

**Prompts:**
> "Generate realistic mock data for the grid items (titles, venues, dates, prices, images)."
>
> "Just stick to images of events: a tech conference on AI and Maestro Ilaiyaraaja's concert."  → "Just stick to images of music, AI and NFL."
>
> "Let us work on the images: use good images of Ilaiyaraaja, maybe a combo of Claude and OpenAI logos, and a Carnatic music instrument."
>
> "Change the watch party image to something reflecting football." / "You could do better with the Gen AI hackathon image."


### 2. Prompting for validation
**Done by AI:**
- Wrote the `validate()` function and email regex in `screens/DetailFormScreen.js`. Name is required, email must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, and quantity must be a whole number from 1 to 10.
- Added the `touched` state so errors appear only after a field is used.
- Wired `isValid` to disable and grey out the submit button.
- Used a plain JavaScript regex instead of Yup or Zod to keep dependencies minimal and Snack-compatible.

**Prompt:**
> "Implement real-time client-side validation for the order form: valid email format, required fields and quantity limits (1–10). Show inline error messages under each field and keep the submit button disabled until the form is valid. Keep it simple, without a schema library."

### 3. Refactoring for adaptability
**Done by AI:**
- Added `useWindowDimensions()` breakpoints (2, 3 or 4 columns) and `key={cols}` so the `FlatList` remounts when the column count changes.
- Replaced `flex: 1` cards with a width computed from the screen, so cards keep their column size even when the last row isn't full. The problem showed up when the catalog had only 2 events.
- Fixed oversized local images, which ignored `aspectRatio` on Android, by giving them an explicit width and height based on the card width.
- Cut an initial plan of about 4/10 complexity down to about 2/10 for adapatability.
**Prompts:**
> "Use `useWindowDimensions()` to change grid columns: 2 on mobile portrait, 3–4 on landscape or tablet."
>
> "On a scale of simplicity, 1 being simple and 10 being complex, how would you rate your refactoring of my original implementation? (keep my work and don't make drastic changes)" → "Trim it to about 2/10."


## Image credits

All card images are stored in `assets/events/` and were taken from Wikimedia Commons.

| File | Source | Licence |
|------|--------|---------|
| `ilaiyaraaja.jpg` | [Ilaiyaraaja at the TFPC Press Meet ahead of the 'Ilaiyaraaja 75' Concert](https://commons.wikimedia.org/wiki/File:Ilaiyaraaja_at_the_TFPC_Press_Meet_Held_Ahead_Of_The_%E2%80%98Ilaiyaraaja_75%E2%80%99_Concert.jpg), photo by Dani Charles | CC BY-SA 3.0 |
| `veena.png` | [Saraswati veena (Indian long-necked lute)](https://commons.wikimedia.org/wiki/File:Saraswati_veena_(Indian_long-necked_lute).png), photo by Katharina Common | CC BY-SA 4.0 |
| `genai.jpg` | [DALL-E 2: "A photo of a robot hand drawing, digital art"](https://commons.wikimedia.org/wiki/File:DALL-E_2_%22A_photo_of_a_robot_hand_drawing,_digital_art%22.jpg), AI-generated image | Public domain |
| `nfl-game.jpg` | [NFL Wild Card Game, Packers at Cardinals](https://commons.wikimedia.org/wiki/File:NFL_Wild_Card_Game_Packers_at_Cardinals.JPG), photo by Gonzo fan2007 | CC BY-SA 3.0 |
| `football.jpg` | [Football on ground](https://commons.wikimedia.org/wiki/File:Football_on_ground.jpg), photo by Dsw4 | Public domain |
| `claude.png` | [Claude AI symbol](https://commons.wikimedia.org/wiki/File:Claude_AI_symbol.svg) | CC0 |
| `openai.png` | [OpenAI logo 2025 (symbol)](https://commons.wikimedia.org/wiki/File:OpenAI_logo_2025_(symbol).svg) | Public domain |