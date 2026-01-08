export const Loading = (loading) => {
    return loading?.loading && <div className="fixed w-full h-full bg-black/20 z-50 inset-0">
        <div className="loading-spinner">
            <div className="bg-purple-600"></div>   
            <div className="bg-purple-600"></div>    
            <div className="bg-purple-600"></div>    
            <div className="bg-purple-600"></div>    
            <div className="bg-purple-600"></div>    
            <div className="bg-purple-600"></div>    
            <div className="bg-purple-600"></div>    
            <div className="bg-purple-600"></div>    
            <div className="bg-purple-600"></div>    
            <div className="bg-purple-600"></div>    
        </div>
    </div>
}