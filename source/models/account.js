/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  /** @class

    Provides special number handling capabilities for documents that are Accounts.

    @extends XM.Document
  */

  XM.AccountDocument = XM.Document.extend({
    /** @scope XM.AccountDocument.prototype */

    numberPolicySetting: 'CRMAccountNumberGeneration',

    requiredAttributes: [
      "number"
    ],
    
    /**
      Return a matching record id for a passed user `key` and `value`. If none
      found, returns zero.

      @param {String} Property to search on, typically a user key
      @param {String} Value to search for
      @param {Object} Options
      @returns {Object} Receiver
    */
    findExisting: function (key, value, options) {
      if (this._converted) { return this; }
      var params = [ key, value, this.id || -1 ],
        dataSource = options.dataSource || XT.dataSource;
      dataSource.dispatch('XM.Account', 'findExisting', params, options);
      XT.log("XM.Account.findExisting");
      return this;
    }
    
  });

  /**
    @class

    @extends XT.AccountDocument
  */
  XM.Account = XM.AccountDocument.extend({
    /** @scope XM.Account.prototype */

    recordType: 'XM.Account',

    defaults: function () {
      return {
        owner: XM.currentUser,
        isActive: true,
        accountType: 'O'
      };
    },

    requiredAttributes: [
      "accountType",
      "isActive",
      "number",
      "name"
    ],
    
    /**
      A boolean property will be created for each one of these prepended by "is."
      So a property `isUserAccount` will be created for the attribute `userAccount`.
      These properties  will be boolean values maintained as their attributes are
      updated. Each role attribute will be mapped to its corresponding property
      in `attributeDelegates`.
    */
    roleAttributes: [
      "salesRep",
      "taxAuthority",
      "userAccount",
      "competitor",
      "partner"
    ],

    // ..........................................................
    // METHODS
    //
  
    /**
      Return the equivilent property name for an account role attribute.
    */
    getRolePropertyName: function (role) {
      return "is" + role.slice(0, 1).toUpperCase() + role.slice(1);
    },
    
    initialize: function (attributes, options) {
      XM.AccountDocument.prototype.initialize.apply(this, arguments);
      var evt = "",
        that = this;
      this.roles = [];
      
      // Add event handling for role attributes and add them to listing
      // of attribute delegates which will be boolean values
      _.each(this.roleAttributes, function (role) {
        evt += "change:" + role + " ";
        that.attributeDelegates[role] = that.getRolePropertyName(role);
      });
      evt = evt.trim();
      this.on(evt, this.roleDidChange);
      this.roleDidChange();
    },
    
    /**
      Update the attribute delegate (property) boolean value for each role.
    */
    roleDidChange: function (model, value, options) {
      var that = this;
      _.each(this.roleAttributes, function (role) {
        var prop = that.getRolePropertyName(role);
        that[prop] = that.get(role) ? true : false;
      });
    },
 
    validateEdit: function (attributes) {
      if (attributes.parent && attributes.parent.id === this.id) {
        return XT.Error.clone('xt2006');
      }
    }

  });
  
  XM.Account.used = function (id, options) {
    return XT.dataSource.dispatch('XM.Account', 'used', id, options);
  };

  /**
    @class

    @extends XM.Comment
  */
  XM.AccountComment = XM.Comment.extend({
    /** @scope XM.AccountComment.prototype */

    recordType: 'XM.AccountComment',

    sourceName: 'CRMA'

  });

  /**
    @class

    @extends XM.CharacteristicAssignment
  */
  XM.AccountCharacteristic = XM.CharacteristicAssignment.extend({
    /** @scope XM.AccountCharacteristic.prototype */

    recordType: 'XM.AccountCharacteristic'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.AccountAccount = XM.Model.extend({
    /** @scope XM.AccountAccount.prototype */

    recordType: 'XM.AccountAccount',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.AccountContact = XM.Model.extend({
    /** @scope XM.AccountContact.prototype */

    recordType: 'XM.AccountContact',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.AccountIncident = XM.Model.extend({
    /** @scope XM.AccountIncident.prototype */

    recordType: 'XM.AccountIncident',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.AccountItem = XM.Model.extend({
    /** @scope XM.AccountItem.prototype */

    recordType: 'XM.AccountItem',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.AccountFile = XM.Model.extend({
    /** @scope XM.AccountFile.prototype */

    recordType: 'XM.AccountFile',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.AccountUrl = XM.Model.extend({
    /** @scope XM.AccountUrl.prototype */

    recordType: 'XM.AccountUrl',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.AccountProject = XM.Model.extend({
    /** @scope XM.AccountProject.prototype */

    recordType: 'XM.AccountProject',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Info
  */
  XM.AccountRelation = XM.Info.extend({
    /** @scope XM.AccountRelation.prototype */

    recordType: 'XM.AccountRelation',

    editableModel: 'XM.Account',

    descriptionKey: "name"

  });

  /**
    @class

    @extends XM.Info
  */
  XM.AccountListItem = XM.Info.extend({
    /** @scope XM.AccountListItem.prototype */

    recordType: 'XM.AccountListItem',

    editableModel: 'XM.Account'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.AccountListItemCharacteristic = XM.Model.extend({
    /** @scope XM.AccountListItemCharacteristic.prototype */

    recordType: 'XM.AccountListItemCharacteristic'

  });
  
  /**
    @class

    @extends XM.Model
  */
  XM.AccountAddressListItem = XM.Model.extend({
    /** @scope XM.AccountAddressListItem.prototype */

    recordType: 'XM.AccountAddressListItem'

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.AccountAddressListItemCollection = XM.Collection.extend({
    /** @scope XM.AccountAddressListItemCollection.prototype */

    model: XM.AccountAddressListItem

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.AccountListItemCollection = XM.Collection.extend({
    /** @scope XM.AccountListItemCollection.prototype */

    model: XM.AccountListItem

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.AccountRelationCollection = XM.Collection.extend({
    /** @scope XM.AccountRelationCollection.prototype */

    model: XM.AccountRelation

  });

}());
