const ai = require("../config/gemini");

const  generateDescription = async (req, res) => {
    try {

        const {
            title,
            country,
            location,
            price,
            category
        } = req.body;

        const prompt = `
You are an expert Airbnb copywriter.

Generate a professional property description.

Property Details:

Title: ${title}

Country: ${country}

Location: ${location}

Category: ${category}

Price: ₹${price} per night

Instructions:
- Around 120–150 words
- Friendly and engaging
- Highlight location and experience
- Do not use markdown
- Return only the description
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        res.json({
            success: true,
            description: response.text
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "AI generation failed"
        });
    }
};
module.exports = generateDescription;