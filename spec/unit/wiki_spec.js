const sequelize = require("../../src/db/models").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {
  beforeEach(done => {
    this.wiki;
    this.user;
    sequelize.sync({ force: true }).then(res => {
      User.create({
        username: "Bryano",
        email: "example@gmail.com",
        password: "123456789"
      }).then(user => {
        this.user = user;

        Wiki.create({
          title: "Wikis",
          body: "Wikis body",
          private: false,
          userId: this.user.id
        })
          .then(wiki => {
            this.wiki = wiki;
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
  });

  describe("#create()", () => {
    it("should create a wiki object with a title, body and choices for wikis", done => {
      Wiki.create({
        title: "Wikis 1",
        body: "1st Wikis",
        private: false,
        userId: this.user.id
      })
        .then(wiki => {
          expect(wiki.title).toBe("Wikis 1");
          expect(wiki.body).toBe("1st Wikis");
          expect(wiki.userId).toBe(this.user.id);
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });

    it("should not create a wiki object with a missing title, body or unselected types of wikis", done => {
      Wiki.create({
        title: "Oops ! Stop here",
        userId: this.user.id
      })
        .then(wiki => {
          done();
        })
        .catch(err => {
          expect(err.message).toContain("Wiki.body cannot be null");
          done();
        });
    });
  });

  describe("#setUser()", () => {
    it("should associate a user and a wiki together", done => {
      User.create({
        username: "Bryano",
        email: "example@gmail.com",
        password: "123456789"
      }).then(newUser => {
        expect(this.wiki.userId).toBe(this.user.id);

        this.wiki.setUser(newUser).then(wiki => {
          expect(this.wiki.userId).toBe(newUser.id);
          done();
        });
      });
    });
  });

  describe("#getUser()", () => {
    it("should return the associated user", done => {
      this.wiki.getUser().then(associatedUser => {
        expect(associatedUser.username).toBe("khang");
        done();
      });
    });
  });
});
