using System.Linq.Expressions;
using TurnoPOS.Data.Models.Base;

namespace TurnoPOS.Data.Repositories;

public interface IGenericRepository : IDisposable
{
    IQueryable<TEntity> Query<TEntity>() where TEntity : BaseEntity;
    IQueryable<TEntity> Get<TEntity>(
        Expression<Func<TEntity, bool>>? filter = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
        int? page = null,
        int? pageSize = null,
        params string[] includeProperties) where TEntity : BaseEntity;
    IQueryable<TEntity> Get<TEntity>(
        Expression<Func<TEntity, bool>>? filter = null,
        params string[] includeProperties) where TEntity : BaseEntity;
    ValueTask<TEntity?> GetById<TEntity>(long id) where TEntity : BaseEntity;
    TEntity Insert<TEntity>(TEntity entity) where TEntity : BaseEntity;
    void Delete<TEntity>(long id) where TEntity : BaseEntity;
    void Delete<TEntity>(TEntity entityToDelete) where TEntity : BaseEntity;
    void Update<TEntity>(TEntity entityToUpdate) where TEntity : BaseEntity;
    Task<int> SaveAsync();
    Task<int> CountAsync<TEntity>(IQueryable<TEntity> query) where TEntity : BaseEntity;
    Task<TEntity?> FirstOrDefault<TEntity>(IQueryable<TEntity> query) where TEntity : BaseEntity;
    Task<List<TEntity>> ToList<TEntity>(IQueryable<TEntity> query) where TEntity : BaseEntity;
    Task<bool> AnyAsync<TEntity>(IQueryable<TEntity> query, Expression<Func<TEntity, bool>> expression) where TEntity : BaseEntity;
}