using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetMarketplace.Api.Data;
using PetMarketplace.Api.Dtos.Products;

namespace PetMarketplace.Api.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _db;

    public CategoriesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _db.Categories
            .OrderBy(c => c.DisplayOrder)
            .Select(c => new CategoryDto(c.Id, c.Name, c.DisplayOrder))
            .ToListAsync();

        return Ok(categories);
    }
}
