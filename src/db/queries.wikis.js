const Wiki = require("./models").Wiki;

module.exports = {
  getAllWikis(callback) {
    return Wiki.all()

      .then(wikis => {
        callback(null, wikis);
      })
      .catch(err => {
        callback(err);
      });
  },

  addWiki(newWiki, callback) {
    return Wiki.create(newWiki)
      .then(wiki => {
        callback(null, wiki);
      })
      .catch(err => {
        callback(err);
      });
  },

  getWiki(id, callback) {
    return Wiki.findById(id)
      .then(wiki => {
        callback(null, wiki);
      })
      .catch(err => {
        callback(err);
      });
  },

  deleteWiki(req, callback) {
    return Wiki.findById(req.params.id)
      .then(wiki => {
        const authorized = new Authorizer(req.user, wiki).destroy();

        if (authorized) {
          wiki.destroy().then(res => {
            callback(null, wiki);
          });
        } else {
          req.flash("notice", "You are not authorized to do that.");
          callback(401);
        }
      })
      .catch(err => {
        callback(err);
      });
  },

  updateWiki(id, updatedWiki, callback) {
    return Wiki.findById(id).then(wiki => {
      if (!wiki) {
        return callback("Wiki not found");
      }

      wiki
        .update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        })
        .then(() => {
          callback(null, wiki);
        })
        .catch(err => {
          callback(err);
        });
    });
  },
  downgradePrivateWikis(id) {
    return Wiki.all()
      .then(wikis => {
        wikis.forEach(wiki => {
          if (wiki.userId == id && wiki.private == true) {
            wiki.update({
              private: false
            });
          }
        });
      })
      .catch(err => {
        callback(err);
      });
  }
};
