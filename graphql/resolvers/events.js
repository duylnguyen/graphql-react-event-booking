const Event = require('../../models/event')
const { transformEvent } = require('./merge')

module.exports = {
    events: async () => {
        try {
        const events = await Event.find()  // .populate('creator')
            return events.map(event => {
                return transformEvent(event)
            })
        } catch (err) {
            throw err
        }                
    },

    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5d8bb7be82da44a9cf045124'
        })
        let createdEvent
        try {
        const result = await event.save()
            createdEvent = transformEvent(result)
            const creator = await User.findById('5d8bb7be82da44a9cf045124')
                if (!creator) {
                    throw new Error('User not found.')
                }
                creator.createdEvents.push(event)
                await creator.save()
                return createdEvent
        } catch (err) {
            throw err
        }
    }
}