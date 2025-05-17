import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Mock data
const categories = [
    { name: 'Conference', description: 'Professional gatherings for learning and networking', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Music', description: 'Live music events and concerts', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Workshop', description: 'Hands-on learning experiences', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Sports', description: 'Athletic events and competitions', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Arts', description: 'Visual and performing arts events', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Entertainment', description: 'Fun and recreational events', image: 'https://images.unsplash.com/photo-1585211969224-3e992986159d?q=80&w=2071&auto=format&fit=crop' },
    { name: 'Charity', description: 'Fundraising and community service events', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop' },
];

const tags = [
    { name: 'Tech' },
    { name: 'Business' },
    { name: 'Networking' },
    { name: 'Festival' },
    { name: 'Summer' },
    { name: 'Live Music' },
    { name: 'Marketing' },
    { name: 'Digital' },
    { name: 'Charity' },
    { name: 'Running' },
    { name: 'Education' },
    { name: 'Art' },
    { name: 'Exhibition' },
    { name: 'Free' },
    { name: 'Comedy' },
    { name: 'Nightlife' },
    { name: 'Performance' },
    { name: 'Fundraising' },
    { name: 'Formal' },
    { name: 'Dinner' },
    { name: 'Film' },
];

const events = [
    {
        title: 'Tech Conference 2025',
        description: 'Join the biggest tech conference in the city with renowned speakers and networking opportunities.',
        date: new Date(2025, 5, 15),
        time: '9:00 AM - 5:00 PM',
        location: 'Downtown Convention Center',
        price: 199,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
        capacity: 500,
        isFeatured: true,
        categoryName: 'Conference',
        tagNames: ['Tech', 'Business', 'Networking']
    },
    {
        title: 'Summer Music Festival',
        description: 'A weekend of amazing performances by top artists across multiple genres.',
        date: new Date(2025, 7, 5),
        time: '12:00 PM - 11:00 PM',
        location: 'Riverside Park',
        price: 89,
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop',
        capacity: 2000,
        isFeatured: true,
        categoryName: 'Music',
        tagNames: ['Festival', 'Summer', 'Live Music']
    },
    {
        title: 'Digital Marketing Workshop',
        description: 'Learn the latest strategies and tools to level up your marketing skills.',
        date: new Date(2025, 4, 22),
        time: '10:00 AM - 3:00 PM',
        location: 'Business Hub',
        price: 49,
        image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=2073&auto=format&fit=crop',
        capacity: 50,
        isFeatured: true,
        categoryName: 'Workshop',
        tagNames: ['Marketing', 'Business', 'Digital']
    },
    {
        title: 'Charity Run for Education',
        description: '5k and 10k runs to raise funds for underprivileged children\'s education.',
        date: new Date(2025, 3, 10),
        time: '7:00 AM',
        location: 'City Park',
        price: 25,
        image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=2074&auto=format&fit=crop',
        capacity: 300,
        isFeatured: true,
        categoryName: 'Sports',
        tagNames: ['Charity', 'Running', 'Education']
    },
    {
        title: 'Art Exhibition: Future Perspectives',
        description: 'Showcasing works by emerging artists exploring themes of technology and humanity.',
        date: new Date(2025, 5, 1),
        time: '10:00 AM - 6:00 PM',
        location: 'Modern Art Gallery',
        price: 0,
        image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop',
        capacity: 200,
        isFeatured: true,
        categoryName: 'Arts',
        tagNames: ['Art', 'Exhibition', 'Free']
    },
    {
        title: 'Comedy Night',
        description: 'An evening of laughter with the city\'s best stand-up comedians.',
        date: new Date(2025, 2, 25),
        time: '8:00 PM',
        location: 'Laugh Factory',
        price: 35,
        image: 'https://images.unsplash.com/photo-1585211969224-3e992986159d?q=80&w=2071&auto=format&fit=crop',
        capacity: 100,
        isFeatured: true,
        categoryName: 'Entertainment',
        tagNames: ['Comedy', 'Nightlife', 'Performance']
    },
    {
        title: 'Charity Gala Dinner',
        description: 'An elegant evening to raise funds for local homeless shelters.',
        date: new Date(2025, 6, 12),
        time: '7:00 PM - 11:00 PM',
        location: 'Grand Ballroom',
        price: 150,
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop',
        capacity: 150,
        isFeatured: true,
        categoryName: 'Charity',
        tagNames: ['Fundraising', 'Formal', 'Dinner']
    },
    {
        title: 'Film Festival Opening',
        description: 'Opening night of the international film festival with premiere screenings.',
        date: new Date(2025, 9, 5),
        time: '6:00 PM - 10:00 PM',
        location: 'Cinema Plaza',
        price: 50,
        image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop',
        capacity: 300,
        isFeatured: true,
        categoryName: 'Entertainment',
        tagNames: ['Film', 'Festival', 'Arts']
    },
];

export async function main() {
    const prisma = new PrismaClient();

    try {
        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = await prisma.user.upsert({
            where: { email: 'admin@eventhub.com' },
            update: {},
            create: {
                email: 'admin@eventhub.com',
                password: hashedPassword,
                name: 'Admin User',
                role: 'ADMIN',
                isVerified: true,
            },
        });

        console.log('Admin user created:', admin.email);

        // Create categories
        const createdCategories = await Promise.all(
            categories.map(async (category) => {
                return prisma.category.upsert({
                    where: { name: category.name },
                    update: {},
                    create: category,
                });
            })
        );

        console.log(`${createdCategories.length} categories created`);

        // Create tags
        const createdTags = await Promise.all(
            tags.map(async (tag) => {
                return prisma.tag.upsert({
                    where: { name: tag.name },
                    update: {},
                    create: tag,
                });
            })
        );

        console.log(`${createdTags.length} tags created`);

        // Create events
        for (const event of events) {
            const { categoryName, tagNames, ...eventData } = event;

            // Find category ID
            const category = await prisma.category.findUnique({ where: { name: categoryName } });

            if (!category) {
                console.log(`Category ${categoryName} not found, skipping event ${event.title}`);
                continue;
            }

            // Create event
            const createdEvent = await prisma.event.create({
                data: {
                    ...eventData,
                    categoryId: category.id,
                    organizerId: admin.id,
                    availableSeats: eventData.capacity,
                },
            });

            // Connect tags
            if (tagNames && tagNames.length > 0) {
                for (const tagName of tagNames) {
                    const tag = await prisma.tag.findUnique({ where: { name: tagName } });
                    if (tag) {
                        await prisma.tagsOnEvents.create({
                            data: {
                                eventId: createdEvent.id,
                                tagId: tag.id,
                            },
                        });
                    }
                }
            }

            console.log(`Event created: ${createdEvent.title}`);
        }

        console.log('Seed completed successfully');
    } catch (error) {
        console.error('Error during seeding:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Only run directly if not imported
if (require.main === module) {
    main()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        });
} 