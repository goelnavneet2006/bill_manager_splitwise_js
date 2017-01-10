/**
 * Global constants.
 */
var CONSTANTS = {
  FRIEND_LIST : "friendList",
  BILL_LIST : "billList",
  FRIEND_CHECKBOX_CLASS : "friend-checkbox-class"
};

/**
 * Friend constructor.
 */
function Friend(emailId, name) {
  this.emailId = emailId;
  this.name = name;
}

/**
 * Bill constructor.
 */
function Bill(billIndex, date, totalAmount, description, friendsList) {
  this.billIndex = billIndex;
  this.date = date;
  this.totalAmount = totalAmount;
  this.description = description;
  this.friendsList = friendsList;
}

var billManager = (function() {

  /**
   * friendList singleton class.
   */
  var singletonFriendList = {
    isDuplicateEmailId : function(emailId) {
      friendList = this.getFriendList();
      var flag = false;

      friendList.forEach(function(friend) {
        if (friend.emailId == emailId) {
          flag = true;
        }
      });

      return flag;
    },

    addFriend : function(emailId, name) {
      if (!this.isDuplicateEmailId(emailId)) {
        var friendList = this.getFriendList();
        var friend = new Friend(emailId, name);

        friendList.push(friend);
        this.setFriendList(friendList);
        return true;
      }
      return false;
    },

    getFriendList : function() {
      var friendList = localStorage.getItem(CONSTANTS.FRIEND_LIST);
      if (friendList) {
        return JSON.parse(friendList);
      } else {
        return [];
      }
    },

    setFriendList : function(friendList) {
      if (friendList.length > 0) {
        localStorage.setItem(CONSTANTS.FRIEND_LIST, JSON.stringify(friendList));
      }
    },

    removeFriend : function(emailId) {
      var friendIndex = this.getFriendIndex(emailId);
      var friendList = this.getFriendList();
      if (friendIndex != -1) {
        friendList.splice(friendIndex, 1);
        this.setFriendList(friendList);
        return true;
      }
      return false;
    },

    getFriendIndex : function(emailId) {
      var friendList = this.getFriendList();
      var finalIndex = -1;

      friendList.forEach(function(friend, index) {
        if (friend.emailId == emailId) {
          finalIndex = index;
        }
      });
      return finalIndex;
    },

    getFriend : function(emailId) {
      var friendList = this.getFriendList();
      var finalFriend = null;

      friendList.forEach(function(friend, index) {
        if (friend.emailId == emailId) {
          finalFriend = friend;
        }
      });
      return finalFriend;
    },

    editFriend : function(emailId, valuesObject) {
      var friendIndex = this.getFriendIndex(emailId);
      var friendList = this.getFriendList();
      if (friendIndex != -1) {
        friendList[friendIndex].emailId = valuesObject.emailId;
        friendList[friendIndex].name = valuesObject.name;
        this.setFriendList(friendList);
        return true;
      }
      return false;
    }
  };

  /**
   * billList singleton class.
   */
  var singletonBillList = {
    getBillList : function() {
      var billList = localStorage.getItem(CONSTANTS.BILL_LIST);
      if (billList) {
        return JSON.parse(billList);
      } else {
        return [];
      }
    },

    setBillList : function(billList) {
      if (billList.length > 0) {
        localStorage.setItem(CONSTANTS.BILL_LIST, JSON.stringify(billList));
      }
    },

    addBill : function(totalAmount, description, friendsList) {
      var billList = this.getBillList();
      var billListLength = billList.length;
      var date = new Date();

      var bill = new Bill(billListLength, date, totalAmount, description,
          friendsList);

      billList.push(bill);
      this.setBillList(billList);
      return true;
    },

    removeBill : function(billIndex) {
      var billList = this.getBillList();
      if (billIndex > -1) {
        billList.splice(billIndex, 1);
        this.setBillList(billList);
        return true;
      }
      return false;
    },

    editBill : function(billIndex, totalAmount, description, friendsList) {
      var billList = this.getBillList();
      if (billIndex != -1) {
        var date = new Date();
        billList[billIndex].date = date;
        billList[billIndex].totalAmount = totalAmount;
        billList[billIndex].description = description;
        billList[billIndex].friendsList = friendsList;
        this.setBillList(billList);
        return true;
      }
      return false;
    },

    getBill : function(billIndex) {
      var billList = this.getBillList();
      var finalBill = null;

      billList.forEach(function(bill) {
        if (bill.billIndex == billIndex) {
          finalBill = bill;
        }
      });
      return finalBill;
    }
  };

  return {

    init : function() {
      var friendListContainer = document.getElementById("friend_list");
      this.showFriendList(friendListContainer);
    },

    addEventListeners : function() {
      var self = this;
      var addNewBillElement = document.getElementById("add_new_bill");
      var addNewFriendElement = document.getElementById("add_new_friend");
      var editNewFriendElement = document.getElementById("edit_friend");
      var showAllBills = document.getElementById("view_all_bills");
      var showAllFriends = document.getElementById("view_all_friends");
      var saveEditedBill = document.getElementById("edit_bill");

      addNewBillElement.addEventListener("click", this.addNewBill, false);
      addNewFriendElement.addEventListener("click", this.addNewFriend, false);
      editNewFriendElement.addEventListener("click", this.editNewFriend, false);
      showAllBills.addEventListener("click", function(event) {
        self.showAllBills();
      }, false);
      showAllFriends.addEventListener("click", function(event) {
        self.showAllFriends();
      }, false);
      saveEditedBill.addEventListener("click", this.saveEditedBill, false);
    },

    addNewBill : function(event) {
      var totalAmount = document.getElementById("total_amount").value;
      var description = document.getElementById("description").value;
      var selectedFriends = document.querySelectorAll("input."
          + CONSTANTS.FRIEND_CHECKBOX_CLASS + ":checked");
      var selectedFriendsList = [];

      for (var i = 0; i < selectedFriends.length; i++) {
        selectedFriendsList[i] = {};
        selectedFriendsList[i].emailId = selectedFriends[i].value;
        var tempFriend = singletonFriendList
            .getFriend(selectedFriends[i].value);
        selectedFriendsList[i].name = tempFriend.name;
      }

      singletonBillList.addBill(totalAmount, description, selectedFriendsList);
    },

    saveEditedBill : function(event) {
      var totalAmount = document.getElementById("edit_total_amount").value;
      var description = document.getElementById("edit_description").value;
      var selectedFriends = document.querySelectorAll("input."
          + CONSTANTS.FRIEND_CHECKBOX_CLASS + ":checked");
      var selectedFriendsList = [];

      for (var i = 0; i < selectedFriends.length; i++) {
        selectedFriendsList[i] = {};
        selectedFriendsList[i].emailId = selectedFriends[i].value;
        var tempFriend = singletonFriendList
            .getFriend(selectedFriends[i].value);
        selectedFriendsList[i].name = tempFriend.name;
      }

      singletonBillList.editBill(
          document.getElementById("edit_bill_index").value, totalAmount,
          description, selectedFriendsList);
    },

    addNewFriend : function(event) {
      var emailId = document.getElementById("email_id").value;
      var name = document.getElementById("name").value;
      singletonFriendList.addFriend(emailId, name);
    },

    editNewFriend : function(event) {
      var editedEmailId = document.getElementById("edit_email_id").value;
      var originalEmailId = document.getElementById("original_email_id").value;
      var name = document.getElementById("edit_name").value;
      singletonFriendList.editFriend(originalEmailId, {
        emailId : editedEmailId,
        name : name
      });
    },

    showFriendList : function(element, noCheckbox) {
      var self = this;
      var friendList = singletonFriendList.getFriendList();
      for (var i = 0; i < friendList.length; i++) {
        var parentDiv = document.createElement("div");
        var textNode = document.createTextNode(friendList[i].emailId);
        if (!noCheckbox) {
          var checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.id = friendList[i].emailId;
          checkbox.classList.add(CONSTANTS.FRIEND_CHECKBOX_CLASS);
          checkbox.value = friendList[i].emailId;
          parentDiv.appendChild(checkbox);
        } else {
          var editButton = document.createElement("button");
          var deleteButton = document.createElement("button");

          editButton.innerHTML = "Edit";
          editButton.id = friendList[i].emailId;
          deleteButton.innerHTML = "Delete";
          deleteButton.id = friendList[i].emailId;

          editButton.addEventListener("click", function(event) {
            self.openEditFriend(event);
          }, false);
          deleteButton.addEventListener("click", function(event) {
            self.deleteFriend(event);
          }, false);

          parentDiv.appendChild(editButton);
          parentDiv.appendChild(deleteButton);

        }
        parentDiv.appendChild(textNode);
        element.appendChild(parentDiv);
      }
    },

    deleteFriend : function(event) {
      var emailId = event.target.id;
      singletonFriendList.removeFriend(emailId);
      this.showAllFriends();
    },

    openEditFriend : function(event) {
      document.getElementById("edit_email_id").value = "";
      document.getElementById("edit_name").value = "";

      var emaiID = event.target.id;
      var friend = singletonFriendList.getFriend(emaiID);

      document.getElementById("edit_email_id").value = friend.emailId;
      document.getElementById("edit_name").value = friend.name;
      document.getElementById("original_email_id").value = friend.emailId;

      document.getElementById("edit_friend_form").style.display = "block";
    },

    showAllBills : function() {
      var self = this;
      var viewAllBillsContainer = document
          .getElementById("view_all_bills_container");
      viewAllBillsContainer.innerHTML = "";

      var allBills = singletonBillList.getBillList();
      for (var i = 0; i < allBills.length; i++) {
        var listTag = document.createElement("li");
        var editButton = document.createElement("button");
        var deleteButton = document.createElement("button");

        listTag.innerHTML = "Bill Id: " + allBills[i].billIndex + ", Date: "
            + allBills[i].date + ", Total amount: " + allBills[i].totalAmount
            + ", Description: " + allBills[i].description
            + ", Amount per Head: " + parseInt(allBills[i].totalAmount)
            / allBills[i].friendsList.length;

        editButton.innerHTML = "Edit";
        editButton.id = allBills[i].billIndex;
        deleteButton.innerHTML = "Delete";
        deleteButton.id = allBills[i].billIndex;

        editButton.addEventListener("click", function(event) {
          self.openEditBill(event);
        }, false);
        deleteButton.addEventListener("click", function(event) {
          self.deleteBill(event);
        }, false);

        viewAllBillsContainer.appendChild(listTag);
        viewAllBillsContainer.appendChild(editButton);
        viewAllBillsContainer.appendChild(deleteButton);
      }
    },

    showAllFriends : function() {
      var viewAllFriendsContainer = document
          .getElementById("view_all_friends_container");
      viewAllFriendsContainer.innerHTML = "";
      this.showFriendList(viewAllFriendsContainer, true);
    },

    openEditBill : function(event) {
      document.getElementById("edit_total_amount").value = "";
      document.getElementById("edit_description").value = "";
      document.getElementById("edit_friend_list").innerHTML = "";
      document.getElementById("edit_bill_index").value = "-1";

      var billIndex = event.target.id;
      var bill = singletonBillList.getBill(billIndex);
      var editFriendList = document.getElementById("edit_friend_list");

      document.getElementById("edit_bill_index").value = bill.billIndex;
      document.getElementById("edit_total_amount").value = bill.totalAmount;
      document.getElementById("edit_description").value = bill.description;
      this.showFriendList(editFriendList);

      var friendList = singletonFriendList.getFriendList();
      for (var i = 0; i < friendList.length; i++) {
        for (var j = 0; j < bill.friendsList.length; j++) {
          if (friendList[i].emailId == bill.friendsList[j].emailId) {
            document.getElementById(friendList[i].emailId).checked = true;
          }
        }
      }
      document.getElementById("edit_bill_form").style.display = "block";
    },

    deleteBill : function(event) {
      var billIndex = event.target.id;
      singletonBillList.removeBill(billIndex);
      this.showAllBills();
    }
  };
})();

/**
 * Initializing point.
 */
window.onload = function() {
  billManager.init();
  billManager.addEventListeners();
};
