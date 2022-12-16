/** Models */
const Things = require('../models/things.model')
const Users = require('../models/users.model')



module.exports = {
      create: async (req, res) => {
        try {
            const {name, color, material, size, brand} = req.body
            const userId = req.user.session.user.toString()
            if (!userId) return res.status(402).json({"success" : false, "message" :"UserId not valid"});
            const data = {
                owner: userId,
                name,
                material,
                color,
                brand,

            }

                let slugMin = name.toLowerCase()
                let slugNoAccent = slugMin.normalize('NFD').replace(/\p{Diacritic}/gu, "");
                let slugNoSpace = slugNoAccent.replace(/\s/g, "_")
                let slug = slugNoSpace.replace(/'/g, "_");
                data["slug"] = slug    
            
            
            const newThing = await new Things(data).save()
            if (!newThing) {
                res.status(400).json({"success" : false, "message" : "Can't create thing"});
            } else {
                const userToUpdate = await Users.findOne({_id: userId})
                userToUpdate.things.push(newThing._id)
                await userToUpdate.save()
                if (!userToUpdate) {
                    res.status(400).json({"success" : false, "message" : "Can't add new thing to user"});
                } else {
                    res.status(200).json(newThing)
                }
            }
            
        } catch (err) {
          res.status(500).json({"success" : false, "message" : err.message});
          
        }
      },
      update: async (req, res) => {
        try {
            const body = req.body
            const userId = req.user.session.user.toString()
            const thingId = req.params.thingId
            if (!userId) return res.status(402).json({"success" : false, "message" :"UserId not valid"});
            if (!thingId) return res.status(402).json({"success" : false, "message" :"ThingId not valid"});
            const data = {}
            /**
             * Validations
             */

            if (body.name) {
                data["name"] = body.name;
                let slugMin = body.name.toLowerCase()
                let slugNoAccent = slugMin.normalize('NFD').replace(/\p{Diacritic}/gu, "");
                let slugNoSpace = slugNoAccent.replace(/\s/g, "_")
                let slug = slugNoSpace.replace(/'/g, "_");
                data["slug"] = slug    
            }
            if (body.color) {
                data["color"] = body.color;
            }
            if (body.material) {
                data["material"] = body.material;
            }
            if (body.brand) {
                data["brand"] = body.brand;
            }
            if (body.size) {
                data["size"] = body.size;
            }
            const thingToUpdate = await Things.findOneAndUpdate({_id: thingId}, data, {new:true})
            if (!thingToUpdate) {
                res.status(400).json({"success" : false, "message" : "Can't update thing"});
            } else {
                res.status(200).json(thingToUpdate)    
            }
            
        } catch (err) {
          res.status(500).json({"success" : false, "message" : err.message});
          
        }
      },
      delete: async (req, res) => {
        try {
            const thingId = req.params.thingId;
            const userId = req.user.session.user.toString();
            if (!userId) return res.status(402).json({"success" : false, "message" :"UserId not valid"});
            if (!thingId) return res.status(402).json({"success" : false, "message" :"ThingId not valid"});
            const userToUpdate = await Users.findOne({_id: userId})
                userToUpdate.things.pop(thingId)
                await userToUpdate.save()
                if (!userToUpdate) {
                    res.status(400).json({"success" : false, "message" : "Can't add new thing to user"});
                } else {
                    const thingDeleted = await Things.findOneAndDelete({_id: thingId})
                    if (!thingDeleted) return res.status(404).json(global.ERROR("Can't delete thing", 'thingS'))
                    return res.status(200).json({"success" : true, "message" : "thing deleted with success"})
                }

        } catch (err) {
            res.status(500).json({"success" : false, "message" : err.message});
        }
        
      },
      oneThing: async (req, res) => {
        try {
            const slug = req.params.slug;
            if (!slug) return res.status(402).json({"success" : false, "message" :"Missing thing slug"});
            const thingFound = await Things.findOne({slug})
            if (!thingFound) {
              return res.status(400).json("No thing found");
            }
            return res.status(200).json(thingFound);
          } catch (err) {
            res.status(500).json({"success" : false, "message" :err.message });
          }
        
      },
}