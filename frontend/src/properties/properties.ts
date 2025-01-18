
const properties = {

    protocol: "http",
    server: "localhost:3000",
    get serverAddress() {
        return `${this.protocol}://${this.server}`;
    },
}


export default properties;