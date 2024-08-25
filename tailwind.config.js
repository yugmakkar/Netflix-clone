/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["*"],
    theme: {
      extend: {
        backgroundImage:{
          bg: 'url("./images/background.png")',
          form: 'url("./images/formbg.jpg")'
        },
        colors:{
          button: '#E50914'
        },
        fontFamily:{
          roboto: 'Roboto',
          poppins: 'Poppins',
          nunito: 'Nunito Sans'
        },
        screens:{
          'b-sm': '600px',
          'b-lg': '960px',
          'b-lg1': '964px',
          'sm-small': '408px',
          'sm-small1': '442px',
          'sm-big1': '550px',
          'sm-big': '594px',
          'md-large': '770px',
          'md-large0': '740px',
          'md-large1': '860px',
          'after-lg': '1020px',
          'after-lg1': '1123px',
          'big-xl': '1302px'
        }
      },
    },
    plugins: [],
  }