The purpose of this app is to create short links for web URLs, collect clicks statistics and provide some analytics to user about their short links (like popular bit.ly or cutt.ly services). It's quite useful for marketing purposes i think.

Deployment available at https://shrtn-lnk.herokuapp.com/

This project was created for educational purposes with intention to learn MERN stack and have a fun with programming.

It uses Node.js and Express.js to run everything on server side. Cloud MongoDB used as database. There is custom authorization logic with access and refresh tokens to keep user logged in safely. App uses email verification to activate user after sign up. User should confirm activation by link in email within 7 days after registration. After 7 days unactivated user account and all data (short links and clicks) generated by unactivated user will be automatically deleted from app.

Client app created using React framework. Redux used for state management on client side here. For UI components there is Materialize framework used.

For dashboards and chart components i use here Chart.js library with react-chartjs-2 components library. Most of charts data prepared on server side and transfer to client only clean data to visualize on charts.

There is also custom Hooks with HOC created for modal views, allows me to easily use proper modal with needed component anywhere in app with a few lines of code.

For the awesome bots thanks to upklyak from www.freepik.com