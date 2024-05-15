const firebase = require("firebase/app");
require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyBGpnAIAVYljYWuySARpcNCaf1jE_jZQSs",
    authDomain: "firstproject-2e10a.firebaseapp.com",
    projectId: "firstproject-2e10a",
    storageBucket: "firstproject-2e10a.appspot.com",
    messagingSenderId: "804169837571",
    appId: "1:804169837571:web:e44e80ba587a9a8ba13236",
    measurementId: "G-YGWCN654ZQ"
  };

firebase.initializeApp(firebaseConfig);

// Access Firestore
const db = firebase.firestore();

// Data to add
const postsData = [
 
      {
        title: "10 Healthy Habits to Improve Your Life",
        tags: ["#healthy", "#lifestyle", "#wellness"],
        article:
          "Incorporating healthy habits into your daily routine can have a profound impact on your overall well-being. From eating a balanced diet to getting regular exercise, small changes can lead to big results. Here are 10 healthy habits to consider adopting: 1. Start your day with a nutritious breakfast to fuel your body and brain. 2. Make time for physical activity each day, whether it's a brisk walk, yoga, or a workout at the gym. 3. Drink plenty of water throughout the day to stay hydrated and energized. 4. Prioritize sleep by establishing a bedtime routine and aiming for 7-9 hours of quality rest each night. 5. Practice mindfulness or meditation to reduce stress and improve mental clarity. 6. Limit processed foods and sugary snacks, opting instead for whole foods rich in nutrients. 7. Incorporate fruits and vegetables into every meal for added vitamins and minerals. 8. Find activities you enjoy, whether it's hiking, dancing, or playing a sport, to stay active and motivated. 9. Take breaks throughout the day to stretch and relax your muscles, especially if you have a desk post. 10. Surround yourself with supportive friends and family who encourage your healthy lifestyle choices. Remember, consistency is key when it comes to forming new habits, so start small and gradually build on your successes.",
      },
      {
        title: "5 Essential Tips for Starting a New Exercise Routine",
        tags: ["#sport", "#fitness", "#exercise"],
        article:
          "Starting a new exercise routine can be intimidating, but with the right approach, you can set yourself up for success. Here are five essential tips to help you get started: 1. Set realistic goals: Whether you're aiming to lose weight, build muscle, or improve your overall fitness, it's important to set realistic and achievable goals. Start by identifying what you want to accomplish and break it down into smaller, manageable steps. 2. Choose activities you enjoy: Exercise shouldn't feel like a chore, so pick activities that you genuinely enjoy doing. Whether it's running, cycling, swimming, or dancing, find something that gets you excited to move your body. 3. Start slow and gradually increase intensity: It's tempting to dive headfirst into a new exercise routine, but doing too much too soon can lead to burnout or injury. Start slow and gradually increase the intensity and duration of your workouts as your fitness level improves. 4. Listen to your body: Pay attention to how your body feels during and after exercise. If something doesn't feel right or if you're experiencing pain, don't ignore it. Take a break, modify your workout, or seek advice from a fitness professional if needed. 5. Stay consistent: Consistency is key when it comes to seeing results from your exercise routine. Schedule regular workouts into your weekly routine and stick to them as much as possible, even on days when you don't feel like exercising. Remember, every little bit counts, so don't get discouraged if progress is slow at first. Stay patient and stay motivated, and you'll soon reap the rewards of your hard work.",
      },
      {
        title: "The Importance of Mental Health Awareness",
        tags: ["#mentalhealth", "#awareness", "#selfcare"],
        article:
          "Mental health awareness is a crucial component of overall well-being, yet it's often overlooked or stigmatized in society. It's important to recognize that mental health is just as important as physical health and to prioritize self-care accordingly. Here are some reasons why mental health awareness matters: 1. Breaks down stigma: By openly discussing mental health issues and sharing personal experiences, we can help break down the stigma surrounding mental illness and encourage others to seek help when needed. 2. Promotes early intervention: Increased awareness of mental health issues can lead to earlier detection and intervention, which can improve outcomes and prevent further suffering. 3. Encourages self-care: When we prioritize mental health awareness, we're more likely to take proactive steps to care for our emotional well-being, such as practicing self-care techniques, seeking therapy, or reaching out for support from loved ones. 4. Fosters empathy and understanding: By raising awareness about mental health, we can foster empathy and understanding towards those who are struggling, creating a more compassionate and supportive community. 5. Strengthens resilience: Building mental health awareness can help individuals develop coping skills and resilience to better navigate life's challenges and setbacks. Overall, mental health awareness plays a vital role in creating a society where everyone feels valued, supported, and able to access the resources they need to thrive.",
      },
      {
        title: "The Benefits of Meditation for Mind and Body",
        tags: ["#meditation", "#mindfulness", "#wellness"],
        article:
          "Meditation is a powerful practice that offers numerous benefits for both the mind and body. From reducing stress and anxiety to improving focus and sleep, incorporating meditation into your daily routine can lead to profound positive changes. Here are some of the key benefits of meditation: 1. Reduces stress: Meditation activates the body's relaxation response, helping to decrease stress hormones and promote feelings of calmness and relaxation. 2. Improves focus and concentration: Regular meditation practice can enhance cognitive function and attention span, making it easier to stay focused and present in the moment. 3. Enhances emotional well-being: Meditation cultivates awareness of thoughts and emotions, allowing for greater self-awareness and emotional regulation. This can lead to reduced symptoms of depression and anxiety. 4. Promotes better sleep: Meditation can help calm the mind and relax the body, making it easier to fall asleep and improve the quality of sleep. 5. Boosts immune function: Research has shown that meditation can strengthen the immune system, helping the body better defend against illness and disease. 6. Increases self-awareness: Through meditation, individuals can develop a deeper understanding of themselves and their inner workings, leading to greater self-acceptance and personal growth. 7. Enhances creativity: Meditation has been linked to increased creativity and problem-solving skills by quieting the mind and allowing for new insights and perspectives to emerge. 8. Improves relationships: By cultivating compassion and empathy, meditation can improve interpersonal relationships and communication skills, leading to more fulfilling connections with others. 9. Reduces pain: Studies have found that meditation can help reduce the perception of pain by changing the way the brain processes pain signals, offering relief for chronic pain conditions. 10. Promotes overall well-being: Ultimately, the benefits of meditation extend beyond the individual components listed above, contributing to a sense of overall well-being and balance in life.",
      },
      {
        title: "Tips for a Productive Workday",
        tags: ["#productivity", "#work", "#tips"],
        article:
          "A productive workday can lead to greater satisfaction and success in both professional and personal endeavors. By implementing effective strategies and techniques, you can make the most of your time and accomplish your goals more efficiently. Here are some tips for a productive workday: 1. Start with a plan: Before diving into your work, take a few minutes to outline your priorities and set specific goals for the day. Having a clear plan in place will help you stay focused and organized. 2. Minimize distractions: Identify potential distractions in your environment, such as social media, email notifications, or noisy coworkers, and take steps to minimize their impact. This may involve turning off notifications, setting boundaries with colleagues, or finding a quiet space to work. 3. Break tasks into smaller steps: Large projects can feel overwhelming, so break them down into smaller, more manageable tasks. This will make it easier to stay motivated and track your progress as you work towards your goals. 4. Prioritize tasks: Not all tasks are created equal, so prioritize your to-do list based on urgency and importance. Focus on completing high-priority tasks first, then move on to less critical items as time allows. 5. Take regular breaks: Working for extended periods without breaks can lead to burnout and decreased productivity. Instead, schedule regular breaks throughout the day to rest and recharge. This will help you maintain focus and energy levels over the long term. 6. Set boundaries: Establishing boundaries around your work time can help prevent work from spilling over into your personal life. Clearly define your work hours and communicate them to colleagues and clients to ensure uninterrupted time for focused work and relaxation. 7. Use time management techniques: Experiment with different time management techniques,such as the Pomodoro Technique or time blocking, to find a method that works best for you. These tools can help you stay on track and make the most of your available time. 8. Stay organized: Keep your workspace clean and clutter-free to minimize distractions and improve focus. Use tools like to-do lists, calendars, and project management software to stay organized and keep track of deadlines. 9. Practice self-care: Prioritize self-care activities, such as exercise, meditation, and hobbies, to maintain your physical and mental well-being. Taking care of yourself will help you feel more energized and focused during your workday. 10. Reflect and adjust: At the end of each day, take a few minutes to reflect on your accomplishments and identify areas for improvement. Use this feedback to adjust your approach and make changes as needed to optimize your productivity in the future.",
      },
      {
        title: "The Power of Positive Thinking",
        tags: ["#positivity", "#mindset", "#selfimprovement"],
        article:
          "Positive thinking is a powerful mindset that can transform your life and lead to greater happiness, success, and well-being. By focusing on the good in every situation and maintaining an optimistic outlook, you can overcome challenges, build resilience, and create a more fulfilling life. Here are some ways that positive thinking can benefit you: 1. Reduces stress: Positive thinking can help reduce stress by reframing negative thoughts and focusing on solutions rather than problems. This can lead to greater feelings of calmness and relaxation, even in difficult situations. 2. Improves health: Research has shown that positive thinking is associated with better physical health outcomes, including lower blood pressure, reduced risk of heart disease, and a stronger immune system. Maintaining a positive attitude can also promote faster recovery from illness and injury. 3. Boosts resilience: Positive thinking helps build resilience by fostering a growth mindset and encouraging perseverance in the face of adversity. Instead of viewing setbacks as insurmountable obstacles, optimistic individuals see them as opportunities for growth and learning. 4. Enhances relationships: Optimistic individuals tend to be more outgoing, empathetic, and supportive in their relationships with others. By radiating positivity and kindness, you can attract like-minded individuals and cultivate deeper connections with friends, family, and colleagues. 5. Increases productivity: Positive thinking can improve focus, motivation, and creativity, leading to greater productivity and efficiency in both personal and professional endeavors. When you believe in your ability to succeed, you're more likely to take action and pursue your goals with enthusiasm and determination. 6. Fosters happiness: Perhaps the most obvious benefit of positive thinking is increased happiness and life satisfaction. By focusing on the positive aspects of life and practicing gratitude for the blessings you have, you can experience greater joy and fulfillment on a daily basis. 7. Enhances problem-solving skills: Optimistic individuals are better able to approach challenges with a clear and open-minded perspective, allowing them to generate creative solutions and overcome obstacles more effectively. This can lead to greater success in both personal and professional pursuits. 8. Inspires others: Positivity is contagious, and by embodying a positive mindset, you can inspire and uplift those around you. Your optimism and resilience can serve as a source of encouragement and motivation for others to adopt a more positive outlook on life. 9. Improves mental well-being: Positive thinking has been linked to better",
      },
      {
        title: "10 Easy Ways to Incorporate More Vegetables Into Your Diet",
        tags: ["#nutrition", "#healthyeating", "#vegetables"],
        article:
          "Vegetables are an essential part of a healthy diet, providing essential nutrients, fiber, and antioxidants that support overall health and well-being. However, many people struggle to eat enough vegetables on a daily basis. Fortunately, there are plenty of easy and delicious ways to incorporate more vegetables into your diet. Here are 10 ideas to help you get started: 1. Start your day with vegetables: Add vegetables to your breakfast routine by including them in omelets, smoothies, or breakfast burritos. Spinach, tomatoes, peppers, and mushrooms are all great options. 2. Swap out grains for vegetables: Instead of pasta, rice, or bread, try using vegetables as a base for your meals. Spiralized zucchini or spaghetti squash make excellent substitutes for traditional noodles, while cauliflower rice is a tasty alternative to white rice. 3. Snack on vegetables: Keep sliced vegetables like carrots, cucumbers, and bell peppers on hand for easy snacking. Pair them with hummus, guacamole, or Greek yogurt dip for added flavor and nutrition. 4. Add vegetables to soups and stews: Boost the nutritional content of soups and stews by loading them up with vegetables like carrots, celery, onions, and kale. You can also puree vegetables like butternut squash or cauliflower to add creaminess without extra calories. 5. Mix vegetables into main dishes: Incorporate vegetables into your favorite main dishes, such as casseroles, stir-fries, and pasta dishes. Chop up broccoli, spinach, or peppers and add them to sauces, fillings, or toppings for an extra dose of nutrition. 6. Make salads more interesting: Get creative with your salads by adding a variety of colorful vegetables, fruits, nuts, and seeds. Experiment with different combinations and dressings to keep things exciting and flavorful. 7. Sneak vegetables into sauces and spreads: Puree vegetables like carrots, sweet potatoes, or spinach and add them to sauces, spreads, and dips for added flavor, color, and nutrition. This is a great way to sneak in extra veggies for picky eaters. 8. Grill or roast vegetables: Enhance the natural flavors of vegetables by grilling or roasting them until they're tender and caramelized. Vegetables like asparagus, Brussels sprouts, and bell peppers are especially delicious when cooked this way. 9. Make vegetable-based snacks: Get creative with vegetable-based snacks like kale chips, roasted chickpeas, or veggie sushi rolls. These snacks are tasty, satisfying, and packed with nutrients to keep you feeling energized throughout the day. 10. Experiment with new recipes: Don't be afraid to try new vegetables or cooking methods to keep things interesting. Explore different cuisines and recipes from around the world to discover new flavors and textures that you love. With these easy tips and tricks, you can enjoy a more diverse and nutritious diet that's packed with delicious and satisfying vegetables.",
      },
      {
        title: "The Importance of Regular Physical Activity",
        tags: ["#exercise", "#health", "#wellness"],
        article:
          "Regular physical activity is essential for maintaining good health and preventing chronic diseases like heart disease, diabetes, and obesity. From improving cardiovascular fitness to boosting mood and mental well-being, the benefits of exercise are far-reaching and profound. Here are some reasons why regular physical activity is so important: 1. Improves cardiovascular health: Exercise strengthens the heart and improves circulation, reducing the risk of heart disease and stroke. Regular physical activity can also help lower blood pressure",
      },
  
  
];

// Function to add data to Firestore
const addpostsToFirestore = async (postsData) => {
  try {
    // Loop through each post and add it to Firestore
    for (const user of postsData) {
      // Use set with merge to add or update the document
      await db
        .collection("users")
        
        .add(user);
    }
    console.log("posts added to Firestore successfully!");
  } catch (error) {
    console.error("Error adding posts to Firestore: ", error);
  }
};

// Call the function to add posts data to Firestore
addpostsToFirestore(postsData);
