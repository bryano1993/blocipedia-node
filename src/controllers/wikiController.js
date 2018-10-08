const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/wiki");
const markdown = require("markdown").markdown;
module.exports = {
  public(req, res, next) {
    wikiQueries.getAllPublicWikis((err, wikis) => {
      if (err) {
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/public", { wikis });
      }
    });
  },
  private(req, res, next) {
    wikiQueries.getAllPrivateWikis((err, wikis) => {
      if (err) {
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/private", { wikis });
      }
    });
  },
  new(req, res, next) {
    res.render("wikis/new");
  },

  create(req, res, next) {
    let newWiki = {
      title: req.body.title,
      body: req.body.body,
      private: req.body.private,
      userId: req.user.id
    };
    wikiQueries.addWiki(newWiki, (err, wiki) => {
      console.log(err);
      if (err) {
        res.redirect(500, "/wikis/new");
      } else {
        res.redirect(303, `/wikis/${wiki.id}`);
      }
    });
  },

  show(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, result) => {
      wiki = result["wiki"];
      collaborators = result["collaborators"];
      let markdownWiki = {
        title: markdown.toHTML(wiki.title),
        body: markdown.toHTML(wiki.body),
        private: wiki.private,
        userId: wiki.userId,
        id: wiki.id
      };
      console.log(markdownWiki);
      if (err || wiki == null) {
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(
          req.user,
          wiki,
          collaborators
        ).showCollaborators();
        if (authorized) {
          wiki.body = markdown.toHTML(wiki.body);
          res.render("wikis/show", { wiki });
        } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect(`/wikis`);
        }
      }
    });
  },

  destroy(req, res, next) {
    wikiQueries.deleteWiki(req, (err, deletedRecordsCount) => {
      if (err) {
        res.redirect(500, `/wikis/${req.params.id}`);
      } else {
        res.redirect(303, `/wikis`);
      }
    });
  },

  edit(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, result) => {
      wiki = result["wiki"];
      collaborators = result["collaborators"];
      if (err || wiki == null) {
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(req.user, wiki, collaborators).edit();
        if (authorized) {
          res.render("wikis/edit", { wiki, collaborators });
        } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect(`/wikis/${req.params.id}`);
        }
      }
    });
  },

  update(req, res, next) {
    wikiQueries.updateWiki(req.params.id, req.body, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, `/wikis/${req.params.id}/edit`);
      } else {
        res.redirect(`/wikis/${req.params.id}`);
      }
    });
  }
};
