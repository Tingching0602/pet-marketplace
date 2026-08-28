using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetMarketplace.Api.Data;

namespace PetMarketplace.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly AppDbContext _db;

    public HealthController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var canConnect = await _db.Database.CanConnectAsync();
        return Ok(new { status = "ok", db = canConnect ? "connected" : "unreachable" });
    }
}
