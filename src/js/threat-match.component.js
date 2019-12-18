export default Vue.component('your-ip',{
    data: function () {
        return {
          userIP: ''
        }
      },
    methods:
    {
        getUserIP(){
            fetch('https://api.ipify.org?format=json')
            .then(response => {
                if(!response.ok){
                    throw Error(`ERROR: ${response.statusText}`);
                }
                return response.json();
            })
            .then(({ ip }) => {
                this.userIP = ip;
            });
        }
    },
    created(){
        this.getUserIP();
    },
    template: '<h2>Welcome! Your IP Address is: {{ userIP }}</h2>'
});