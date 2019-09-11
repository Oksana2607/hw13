class Users {
    constructor(db) {
        this.collection = db.collection('users');
        // this.collection = db.createIndex({email: 1}, {unique: true});
    }

    async registerNewUser(user) {
        const {name, email, password} = user;
        let query = {name: name, email: email, password: password};
        const checkUser = await this.collection.findOne(query);
        return checkUser ? null : await this.addUser(user);
    }

    async addUser(user) {
        try {
            return await this.collection.insertOne(user);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async findUser(user) {
        const { name, email, password } = user;
        let query = {name: name, email: email, password: password};

        } catch (error) {
            throw new Error(error.message);
        }


    async registerNewUser(user) {
        const {name, email, password} = user;
        let query = {name: name, email: email, password: password};
        const checkUser = await this.collection.findOne(query);
        return checkUser ? null : await this.addUser(user);
    }

    async loginUser(user) {
        const {name, email, password} = user;
        let query = {name: name, email: email, password: password};
        return await this.collection.findOne(query);
    };

    async clearAllUsers(user) {
        this.collection.drop();
    };
}

module.exports = Users;