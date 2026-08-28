using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PetMarketplace.Api.Models.Entities;

namespace PetMarketplace.Api.Data.Seed;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var db = services.GetRequiredService<AppDbContext>();
        await db.Database.MigrateAsync();

        await SeedCategoriesAsync(db);
        var (demoUser, shopUser) = await SeedDemoUsersAsync(services);
        await SeedProductsAsync(db, demoUser, shopUser);
        await SeedConversationsAsync(db, demoUser, shopUser);
    }

    private static async Task SeedCategoriesAsync(AppDbContext db)
    {
        if (await db.Categories.AnyAsync()) return;

        db.Categories.AddRange(
            new Category { Name = "貓咪", DisplayOrder = 1 },
            new Category { Name = "狗狗", DisplayOrder = 2 },
            new Category { Name = "小動物", DisplayOrder = 3 },
            new Category { Name = "用品配件", DisplayOrder = 4 },
            new Category { Name = "玩具", DisplayOrder = 5 }
        );
        await db.SaveChangesAsync();
    }

    private static async Task<(ApplicationUser DemoUser, ApplicationUser ShopUser)> SeedDemoUsersAsync(IServiceProvider services)
    {
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();

        var demoUser = await userManager.FindByEmailAsync("demo@petmarket.test");
        if (demoUser == null)
        {
            demoUser = new ApplicationUser
            {
                UserName = "demo@petmarket.test",
                Email = "demo@petmarket.test",
                DisplayName = "毛孩控小樂",
                AvatarColorHex = "#E9714C",
                EmailConfirmed = true
            };
            await userManager.CreateAsync(demoUser, "Passw0rd!1");
        }

        var shopUser = await userManager.FindByEmailAsync("shop@petmarket.test");
        if (shopUser == null)
        {
            shopUser = new ApplicationUser
            {
                UserName = "shop@petmarket.test",
                Email = "shop@petmarket.test",
                DisplayName = "喵喵二手屋",
                AvatarColorHex = "#6FBFA0",
                EmailConfirmed = true
            };
            await userManager.CreateAsync(shopUser, "Passw0rd!1");
        }

        return (demoUser, shopUser);
    }

    private static async Task SeedProductsAsync(AppDbContext db, ApplicationUser demoUser, ApplicationUser shopUser)
    {
        if (await db.Products.AnyAsync()) return;

        var categories = await db.Categories.ToDictionaryAsync(c => c.Name, c => c.Id);

        var products = new List<Product>
        {
            new() { Title = "貓抓板柱 二手9成新", Price = 280, Condition = ProductCondition.Used, CategoryId = categories["貓咪"], BgColorHex = "#DCEEE5", IconKind = "scratcher", Rating = 4.8m, SellerId = shopUser.Id },
            new() { Title = "中型狗窩床墊 全新未拆", Price = 650, Condition = ProductCondition.New, CategoryId = categories["狗狗"], BgColorHex = "#F7E3D0", IconKind = "bed", Rating = 4.9m, SellerId = shopUser.Id },
            new() { Title = "牽繩項圈組 附骨頭吊牌", Price = 150, Condition = ProductCondition.Used, CategoryId = categories["用品配件"], BgColorHex = "#FBEFD1", IconKind = "leash", Rating = 4.7m, SellerId = shopUser.Id },
            new() { Title = "逗貓棒羽毛玩具", Price = 99, Condition = ProductCondition.Used, CategoryId = categories["玩具"], BgColorHex = "#F8DDE7", IconKind = "wand", Rating = 4.6m, SellerId = shopUser.Id },
            new() { Title = "透氣外出提籠 附墊", Price = 890, Condition = ProductCondition.Used, CategoryId = categories["用品配件"], BgColorHex = "#DCE9F5", IconKind = "carrier", Rating = 5.0m, SellerId = shopUser.Id },
            new() { Title = "陶瓷雙碗餵食組", Price = 220, Condition = ProductCondition.New, CategoryId = categories["用品配件"], BgColorHex = "#DCEEE5", IconKind = "bowl", Rating = 4.8m, SellerId = shopUser.Id },
            new() { Title = "天竺鼠飼養籠組", Price = 1200, Condition = ProductCondition.Used, CategoryId = categories["小動物"], BgColorHex = "#F7E3D0", IconKind = "cage", Rating = 4.9m, SellerId = shopUser.Id },
            new() { Title = "耐咬骨頭潔牙玩具", Price = 60, Condition = ProductCondition.Used, CategoryId = categories["玩具"], BgColorHex = "#FBEFD1", IconKind = "bone", Rating = 4.7m, SellerId = shopUser.Id },
            new() { Title = "塑膠餵食碗 免費送", Price = 0, Condition = ProductCondition.Used, CategoryId = categories["用品配件"], BgColorHex = "#F8DDE7", IconKind = "bowl", Rating = 4.5m, SellerId = shopUser.Id },
            new() { Title = "逗貓棒(小損)免費出清", Price = 0, Condition = ProductCondition.Used, CategoryId = categories["玩具"], BgColorHex = "#DCEEE5", IconKind = "wand", Rating = 4.3m, SellerId = shopUser.Id },
            new() { Title = "貓咪跳台 二手完好", Price = 450, Condition = ProductCondition.Used, CategoryId = categories["貓咪"], BgColorHex = "#F8DDE7", IconKind = "scratcher", Rating = 4.6m, SellerId = demoUser.Id }
        };

        db.Products.AddRange(products);
        await db.SaveChangesAsync();
    }

    private static async Task SeedConversationsAsync(AppDbContext db, ApplicationUser demoUser, ApplicationUser shopUser)
    {
        if (await db.Conversations.AnyAsync()) return;

        var firstProduct = await db.Products.Where(p => p.SellerId == shopUser.Id).OrderBy(p => p.Id).FirstAsync();

        var conversation = new Conversation
        {
            ProductId = firstProduct.Id,
            BuyerId = demoUser.Id,
            SellerId = shopUser.Id,
            LastMessageAt = DateTime.UtcNow
        };
        conversation.Messages.Add(new Message
        {
            SenderId = shopUser.Id,
            Body = "商品都還在唷,可以面交或宅配寄送。",
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        });

        db.Conversations.Add(conversation);
        await db.SaveChangesAsync();
    }
}
