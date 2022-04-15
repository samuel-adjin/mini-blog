module.exports = [
    {
        name: "Admin",
        permissions: [
            {
                name: "delete-post"
            },
            {
                name: "delete-user"
            },
            {
                name: "add-role"
            },
            {
                name: "manage-roles"
            },
            {
                name: "manage-permissions"
            },
            {
                name: "lock-account"
            },
            {
                name: "view-users"  
            }
        ]
    },
    {
        name: "Action",
        permissions: [
            {
                name: "delete-post"
            },
            {
                name: "lock-account"
            },
            {
                name: "view-users"  
            }
        ]
    },

    {
        name: "Author",
        permissions: [
            {
                name: "create-post"
            },
            {
                name: "edit-post"
            },
            {
                name: "view-users"  
            }
        ]
    },

    {
        name: "User",
        permissions: [
            {
                name: "create-comment"
            },
            {
                name: "read-comment"
            },
            {
                name: "delete-comment"  
            }
        ]
    }
]

// action role can delete and locked user account only 

